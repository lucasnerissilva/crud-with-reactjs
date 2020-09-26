import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import Currency from 'currency-formatter';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface TransactionDetail {
  transactions: Transaction[];
  balance: Balance;
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      // TODO
      const response = await api.get<TransactionDetail>('/transactions');
      setTransactions(response?.data?.transactions);
      setBalance(response?.data?.balance);
    }

    loadTransactions();
  }, []);

  const hasTransactions = transactions.length > 0;

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {Currency.format(balance.income, {
                symbol: 'R$ ',
                decimal: ',',
                thousand: '.',
              })}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {Currency.format(balance.outcome, {
                symbol: 'R$ ',
                decimal: ',',
                thousand: '.',
              })}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {Currency.format(balance.total, {
                symbol: 'R$ ',
                decimal: ',',
                thousand: '.',
              })}
            </h1>
          </Card>
        </CardContainer>

        {hasTransactions && (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(t => {
                  return (
                    <tr key={t.id}>
                      <td className="title">{t.title}</td>
                      {t.type === 'income' ? (
                        <td className="income">
                          {Currency.format(t.value, {
                            symbol: 'R$ ',
                            decimal: ',',
                            thousand: '.',
                          })}
                        </td>
                      ) : (
                        <td className="outcome">
                          {Currency.format(t.value, {
                            symbol: '- R$ ',
                            decimal: ',',
                            thousand: '.',
                          })}
                        </td>
                      )}
                      <td>{t.category?.title}</td>
                      <td>
                        {DateTime.fromISO(t.created_at.toString())
                          .toFormat('dd/LL/yyyy T')
                          .toString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
