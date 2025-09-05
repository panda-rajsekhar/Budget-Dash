import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, FileText } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryColors: { [key: string]: string } = {
  'Food': 'bg-expense-food/10 text-expense-food border-expense-food/20',
  'Transportation': 'bg-expense-transport/10 text-expense-transport border-expense-transport/20',
  'Utilities': 'bg-expense-utilities/10 text-expense-utilities border-expense-utilities/20',
  'Entertainment': 'bg-expense-entertainment/10 text-expense-entertainment border-expense-entertainment/20',
  'Shopping': 'bg-expense-shopping/10 text-expense-shopping border-expense-shopping/20',
  'Healthcare': 'bg-expense-healthcare/10 text-expense-healthcare border-expense-healthcare/20',
  'Education': 'bg-expense-education/10 text-expense-education border-expense-education/20',
  'Room Rent': 'bg-expense-roomrent/10 text-expense-roomrent border-expense-roomrent/20',
  'Other': 'bg-expense-other/10 text-expense-other border-expense-other/20'
};

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No expenses yet</h3>
          <p className="text-muted-foreground text-center">
            Start tracking your expenses by clicking the "Add Expense" button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Expense Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={categoryColors[expense.category] || categoryColors['Other']}
                    >
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={expense.description}>
                      {expense.description || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteExpense(expense.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};