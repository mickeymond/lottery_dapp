import React, { Component } from 'react';
import { Divider, Container, Button, Header, Segment, Message } from 'semantic-ui-react';
import toastr from 'toastr/build/toastr.min.js';
 
class Lottery extends Component {

    state = { manager: '', account: '', accountBalance: '', players: [], contractBalance: '', winner: '' };

    async componentDidMount() {
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });
        }

        const { Lottery } = this.props.drizzle.contracts;
        const { web3 } = this.props.drizzle;

        const account = this.props.drizzleState.accounts[0];
        const contractAddress = Lottery.address;
        const contractBalanceInWei = await web3.eth.getBalance(contractAddress);
        const contractBalance = web3.utils.fromWei(contractBalanceInWei);

        const accountBalanceInWei = this.props.drizzleState.accountBalances[account];
        const accountBalance = web3.utils.fromWei(accountBalanceInWei);

        const manager = await Lottery.methods.manager().call();
        const players = await Lottery.methods.getPlayers().call();
        const winner = await Lottery.methods.winner().call();

        this.setState({ account, accountBalance, manager, players, contractBalance, winner });
    }

    async bid(e) {
        e.preventDefault();
        this.props.showLoader();

        const { Lottery } = this.props.drizzle.contracts;

        try {
            await Lottery.methods.enter().send({ value: 10000000000000000 });
            window.location.reload();
        } catch ({ message }) {
            this.props.hideLoader();
            toastr.error(message);
        }
    }

    async pickWinner(e) {
        e.preventDefault();
        this.props.showLoader();

        const { Lottery } = this.props.drizzle.contracts;

        try {
            await Lottery.methods.pickWinner().send();
            window.location.reload();
        } catch ({ message }) {
            this.props.hideLoader();
            toastr.error(message);
        }
    }
    
    render() {
        return (
            <Container textAlign="center">
                <Segment>
                    <Header as="h1">BLOCKCHAIN LOTTERY APPLICATION</Header>
                </Segment>
                <Divider />
                <Message>
                    <Message.Header>Lottery Manager</Message.Header>
                    <p><strong>{this.state.manager}</strong></p>
                </Message>
                <Divider />
                <Message>
                    <Message.Header>Lottery Information</Message.Header>
                    <p>
                        There are <strong>{this.state.players.length}</strong> participants competing for <strong>{this.state.contractBalance}</strong> Ether.
                    </p>
                </Message>
                <Divider />
                <Message color="green">
                    <Message.Header>Latest Winner</Message.Header>
                    <p><strong>{this.state.winner}</strong></p>
                </Message>
                <Divider />
                <Message>
                    <Message.Header>Place A Bid</Message.Header>
                    <p>Each bid your place is worth 0.01 ether.</p>
                </Message>
                <Button primary onClick={this.bid.bind(this)}>Place A Bid</Button>
                <Divider />
                {this.renderPickWinnerSegment()}
                <Divider />
                <Segment raised>Your Account is: <strong>{this.state.account}</strong></Segment>
                <Segment raised>Your Balance is: <strong>{this.state.accountBalance}</strong> ETH</Segment>
            </Container>
        );
    }

    renderPickWinnerSegment() {
        if(this.state.manager === this.state.account) {
            return (
                <Container>
                    <Message>
                        <Message.Header>Are You Ready To Pick A Winner?</Message.Header>
                    </Message>
                    <Button positive onClick={this.pickWinner.bind(this)}>Pick A Winner</Button>
                </Container>
            );
        }

        return (
            <Message>
                <Message.Header>Please Contact Your Manager To Pick A Winner.</Message.Header>
            </Message>
        );
    }
}

export default Lottery;
