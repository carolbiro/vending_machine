import { useState, useContext } from 'react';
import { ApiError } from '../../services/api';
import { UserContext, User } from '../../contexts/user.context';
import { fetchWithAuth } from '../../services/api';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { DepositContainer } from "./deposit.styles";
import { ButtonsContainer } from '../login/login.styles';

const Deposit = () => {
    const { currentUser: currentUser, setCurrentUser: setCurrentUser } = useContext(UserContext);
    const [deposit, setDeposit] = useState<number | ''>('');

    const updateDeposit = async (transactionMethod: string, requestOptions = { method: 'POST'}) => {
        try {
            const response = await fetchWithAuth(`/transactions/${transactionMethod}`, requestOptions);
            const res = await response.json();

            if (!response.ok) {
                throw new ApiError(`${res.message}`);
            }

            setDeposit('');
            setCurrentUser(res);
        } catch (error) {
            console.error(error);
            if (error instanceof ApiError)
                alert(error.message);
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ deposit }),
        }
        await updateDeposit('deposit', requestOptions);
    };

    const handleResetBalance = async () => {
        await updateDeposit('reset');
    }

    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        const { value } = event.target as HTMLInputElement;
        setDeposit(parseFloat(value));
    };

    return (
        <DepositContainer>
            <form onSubmit={handleSubmit}>
                <h2>Deposit: {currentUser?.deposit} cents</h2>
                <span>Add money in order to buy products</span>
                <FormInput
                    label='Deposit:'
                    type='text'
                    required
                    onChange={handleChange}
                    name='deposit'
                    value={deposit}
                />
                <br />
                <ButtonsContainer>
                    <Button type="submit">Submit</Button>
                    <Button
                        type='button'
                        onClick={handleResetBalance}
                    >
                        Reset Balance
                    </Button>
                </ButtonsContainer>
            </form>
        </DepositContainer>
    );
}

export default Deposit;