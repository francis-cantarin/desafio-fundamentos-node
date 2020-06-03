import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'outcome' | 'income';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(({ type }) => type === 'income')
      .reduce((sum, transaction) => sum + transaction.value, 0);

    const outcome = this.transactions
      .filter(({ type }) => type === 'outcome')
      .reduce((sum, transaction) => sum + transaction.value, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const { income, outcome } = this.getBalance();
      if (outcome + value > income) {
        throw Error(
          'your total outcome can`t be greater than your total income!',
        );
      }
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
