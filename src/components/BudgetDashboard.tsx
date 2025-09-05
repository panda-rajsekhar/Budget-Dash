import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Wallet, TrendingUp, TrendingDown, IndianRupee, Moon, Sun, Trash2, Download } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { useTheme } from "next-themes";
import jsPDF from 'jspdf';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const expenseCategories = [
  { name: 'Food', color: 'hsl(var(--expense-food))', gradient: 'url(#gradientFood)' },
  { name: 'Transportation', color: 'hsl(var(--expense-transport))', gradient: 'url(#gradientTransport)' },
  { name: 'Utilities', color: 'hsl(var(--expense-utilities))', gradient: 'url(#gradientUtilities)' },
  { name: 'Entertainment', color: 'hsl(var(--expense-entertainment))', gradient: 'url(#gradientEntertainment)' },
  { name: 'Shopping', color: 'hsl(var(--expense-shopping))', gradient: 'url(#gradientShopping)' },
  { name: 'Healthcare', color: 'hsl(var(--expense-healthcare))', gradient: 'url(#gradientHealthcare)' },
  { name: 'Education', color: 'hsl(var(--expense-education))', gradient: 'url(#gradientEducation)' },
  { name: 'Room Rent', color: 'hsl(var(--expense-roomrent))', gradient: 'url(#gradientRoomrent)' },
  { name: 'Other', color: 'hsl(var(--expense-other))', gradient: 'url(#gradientOther)' }
];

export const BudgetDashboard = () => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState<number>(0);
  const { theme, setTheme } = useTheme();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBudget = localStorage.getItem('totalBudget');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedBudget) {
      setTotalBudget(parseFloat(savedBudget));
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('totalBudget', totalBudget.toString());
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Prepare data for charts
  const categoryData = expenseCategories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.name);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color,
      gradient: category.gradient
    };
  }).filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses(prev => [...prev, newExpense]);
    setIsExpenseFormOpen(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addMoneyToBudget = () => {
    if (addMoneyAmount > 0) {
      setTotalBudget(prev => prev + addMoneyAmount);
      setAddMoneyAmount(0);
    }
  };

  const clearAllData = () => {
    setTotalBudget(0);
    setExpenses([]);
    localStorage.removeItem('totalBudget');
    localStorage.removeItem('expenses');
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const today = new Date().toLocaleDateString('en-IN');
    let yPos = 115;
    
    // Title
    pdf.setFontSize(20);
    pdf.text('Budget Report', 20, 20);
    
    // Date
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${today}`, 20, 30);
    
    // Budget Summary
    pdf.setFontSize(16);
    pdf.text('Budget Summary', 20, 50);
    pdf.setFontSize(12);
    pdf.text(`Total Budget: ${formatCurrency(totalBudget)}`, 20, 65);
    pdf.text(`Total Spent: ${formatCurrency(totalSpent)}`, 20, 75);
    pdf.text(`Remaining: ${formatCurrency(remainingBudget)}`, 20, 85);
    pdf.text(`Budget Used: ${budgetUsedPercentage.toFixed(1)}%`, 20, 95);
    
    // Category Breakdown
    if (categoryData.length > 0) {
      pdf.setFontSize(16);
      pdf.text('Category Breakdown', 20, yPos);
      pdf.setFontSize(12);
      yPos += 15;
      
      categoryData.forEach(category => {
        const percentage = ((category.value / totalSpent) * 100).toFixed(1);
        pdf.text(`${category.name}: ${formatCurrency(category.value)} (${percentage}%)`, 20, yPos);
        yPos += 10;
      });
    }
    
    // Recent Expenses
    if (expenses.length > 0) {
      pdf.setFontSize(16);
      pdf.text('Recent Expenses', 20, yPos + 20);
      pdf.setFontSize(10);
      let expenseYPos = yPos + 35;
      
      const recentExpenses = expenses.slice(-10); // Show last 10 expenses
      recentExpenses.forEach(expense => {
        const date = new Date(expense.date).toLocaleDateString('en-IN');
        pdf.text(`${date} - ${expense.category} - ${expense.description} - ${formatCurrency(expense.amount)}`, 20, expenseYPos);
        expenseYPos += 8;
        
        // Add new page if needed
        if (expenseYPos > 270) {
          pdf.addPage();
          expenseYPos = 20;
        }
      });
    }
    
    pdf.save(`budget-report-${today.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Budget Dashboard</h1>
            <p className="text-muted-foreground">Track your expenses and manage your budget</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={exportToPDF} variant="outline" className="shadow-medium">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shadow-medium">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your budget data and expenses. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button onClick={() => setIsExpenseFormOpen(true)} className="shadow-medium">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Budget Setup Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Monthly Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Total Budget (₹)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={totalBudget || ''}
                  onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                  placeholder="Enter your monthly budget"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="addMoney">Add Money (₹)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="addMoney"
                    type="number"
                    value={addMoneyAmount || ''}
                    onChange={(e) => setAddMoneyAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Amount to add"
                  />
                  <Button onClick={addMoneyToBudget} disabled={addMoneyAmount <= 0}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">{budgetUsedPercentage.toFixed(1)}% of budget</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                  <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(remainingBudget)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {remainingBudget >= 0 ? 'Within budget' : 'Over budget'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${remainingBudget >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <TrendingDown className={`h-6 w-6 ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      {expenseCategories.map((category, index) => (
                        <linearGradient key={index} id={`gradient${category.name.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={category.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={category.color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient${entry.name.replace(/\s+/g, '')})`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Category Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        boxShadow: 'var(--shadow-medium)',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      labelStyle={{
                        color: 'hsl(var(--foreground))',
                        fontWeight: '600'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#barGradient)" 
                      radius={[4, 4, 0, 0]}
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Expense List */}
        <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />

        {/* Expense Form Modal */}
        <ExpenseForm
          isOpen={isExpenseFormOpen}
          onClose={() => setIsExpenseFormOpen(false)}
          onAddExpense={addExpense}
          categories={expenseCategories.map(cat => cat.name)}
        />
      </div>
    </div>
  );
};