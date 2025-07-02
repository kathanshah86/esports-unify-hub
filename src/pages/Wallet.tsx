
import { useState } from 'react';
import { Plus, Minus, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useGameStore } from '@/store/gameStore';

const Wallet = () => {
  const { walletBalance, walletTransactions, updateBalance, addTransaction } = useGameStore();
  const [amount, setAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      updateBalance(depositAmount);
      addTransaction({
        id: Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        description: 'Wallet deposit',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
      setAmount('');
      setShowDepositForm(false);
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= walletBalance) {
      updateBalance(-withdrawAmount);
      addTransaction({
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: withdrawAmount,
        description: 'Wallet withdrawal',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
      setAmount('');
      setShowWithdrawForm(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <Minus className="w-4 h-4 text-red-500" />;
      case 'prize':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Wallet</h1>
          <p className="text-gray-400 text-lg">
            Manage your tournament prizes and deposits
          </p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/50 mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <DollarSign className="w-16 h-16 mx-auto text-purple-400 mb-2" />
              <h2 className="text-3xl font-bold text-white mb-2">Current Balance</h2>
            </div>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
              ₹{walletBalance.toFixed(2)}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowDepositForm(true)}
                className="bg-green-500 hover:bg-green-600"
                disabled={showDepositForm || showWithdrawForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Deposit Funds
              </Button>
              <Button 
                onClick={() => setShowWithdrawForm(true)}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
                disabled={showDepositForm || showWithdrawForm || walletBalance <= 0}
              >
                <Minus className="w-4 h-4 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Form */}
        {showDepositForm && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Deposit Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₹)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDeposit} className="bg-green-500 hover:bg-green-600">
                  Confirm Deposit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {setShowDepositForm(false); setAmount('');}}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Form */}
        {showWithdrawForm && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₹) - Max: ₹{walletBalance.toFixed(2)}
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={walletBalance}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleWithdraw} className="bg-red-500 hover:bg-red-600">
                  Confirm Withdrawal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {setShowWithdrawForm(false); setAmount('');}}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="text-white font-medium">{transaction.description}</div>
                      <div className="text-gray-400 text-sm">{transaction.date}</div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <div className={`font-bold ${
                        transaction.type === 'deposit' || transaction.type === 'prize' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'prize' ? '+' : '-'}
                        ₹{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <Badge 
                        className={
                          transaction.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {walletTransactions.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No transactions yet</h3>
                <p className="text-gray-500">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Wallet;
