import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { walletService, WalletTransaction } from '@/services/walletService';
import { useToast } from '@/hooks/use-toast';

const WalletAdmin = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await walletService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransaction = async (id: string) => {
    setProcessingId(id);
    try {
      await walletService.updateTransactionStatus(id, 'approved', adminNotes[id]);
      toast({
        title: "Transaction Approved",
        description: "The transaction has been approved and the user's balance has been updated.",
      });
      loadTransactions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectTransaction = async (id: string) => {
    setProcessingId(id);
    try {
      await walletService.updateTransactionStatus(id, 'rejected', adminNotes[id]);
      toast({
        title: "Transaction Rejected",
        description: "The transaction has been rejected.",
      });
      loadTransactions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? 
      <TrendingUp className="w-5 h-5 text-green-400" /> : 
      <TrendingDown className="w-5 h-5 text-red-400" />;
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading transactions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {transactions.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-green-300 text-sm">Pending Transactions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {transactions.filter(t => t.transaction_type === 'deposit' && t.status === 'approved').length}
            </div>
            <div className="text-blue-300 text-sm">Approved Deposits</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <TrendingDown className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {transactions.filter(t => t.transaction_type === 'withdrawal' && t.status === 'approved').length}
            </div>
            <div className="text-orange-300 text-sm">Approved Withdrawals</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Wallet Transactions Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No transactions found
              </div>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div>
                          <div className="text-white font-medium">
                            {transaction.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'} - ₹{transaction.amount}
                          </div>
                          <div className="text-gray-400 text-sm">
                            User ID: {transaction.user_id}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {new Date(transaction.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    
                    {transaction.payment_method && (
                      <div className="text-gray-400 text-sm mb-2">
                        Payment Method: {transaction.payment_method}
                      </div>
                    )}
                    
                    {transaction.transaction_reference && (
                      <div className="text-gray-400 text-sm mb-2">
                        Reference: {transaction.transaction_reference}
                      </div>
                    )}
                    
                    {transaction.status === 'pending' && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          placeholder="Add admin notes (optional)"
                          value={adminNotes[transaction.id] || ''}
                          onChange={(e) => setAdminNotes({
                            ...adminNotes,
                            [transaction.id]: e.target.value
                          })}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveTransaction(transaction.id)}
                            disabled={processingId === transaction.id}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectTransaction(transaction.id)}
                            disabled={processingId === transaction.id}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {transaction.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-600 rounded">
                        <div className="text-gray-300 text-sm">
                          <strong>Admin Notes:</strong> {transaction.admin_notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletAdmin;