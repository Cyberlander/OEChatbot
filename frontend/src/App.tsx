import React, {Component, ReactElement, RefObject} from 'react';
import user from './user-solid.svg';
import robot from './robot-solid.svg';
import {Container, Comment} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import {sendMessage} from "./services/ChatService";
import './App.css'
import TimeAgo from 'react-timeago'
// @ts-ignore
import localeDe from 'react-timeago/lib/language-strings/de'
// @ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import Checkbox from "semantic-ui-react/dist/commonjs/modules/Checkbox";
import {misunderstood} from "./audio";

interface Message {
    sender: 'Bot' | 'Benutzer'
    message: string
    time: Date
}

interface State {
    messages: Message[]
    input: string
    kanyeMode: boolean
    sending: boolean
}

class App extends Component<{}, State> {
    formatter = buildFormatter(localeDe);
    inputRef: RefObject<HTMLInputElement> = React.createRef();
    commentsRef: RefObject<HTMLDivElement> = React.createRef();

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            messages: [],
            input: "",
            kanyeMode: false,
            sending: false,
        }
    }

    componentDidMount(): void {
        if (this.inputRef.current) {
            this.inputRef.current.focus()
        }
    }

    keyHit = async (e: any) => {
        if (e.key == "enter") {
            await this.sendMessage()
        }
    };

    sendMessage = async () => {
        if (!this.state.input) {
            return;
        }
        this.setState(prevState => ({
            messages: [
                ...prevState.messages, {
                    message: this.state.input,
                    sender: "Benutzer",
                    time: new Date()
                }
            ],
            sending: true,
        }));
        const response = await sendMessage(this.state.input, !this.state.kanyeMode);
        this.setState(prevState => ({
            messages: [
                ...prevState.messages, {
                    message: response,
                    sender: "Bot",
                    time: new Date()
                }
            ],
            input: "",
            sending: false,
        }));
        if (response == "Ich verstehe die Frage nicht.") {
            new Audio(misunderstood).play();
        }
        if (this.commentsRef.current) {
            this.commentsRef.current.children[this.commentsRef.current.childNodes.length - 1].scrollIntoView()
        }
        if (this.inputRef.current) {
            this.inputRef.current.focus()
        }
    };

    render() {
        const messages: ReactElement[] = this.state.messages.map((msg, i) => {
            return (
                <Comment key={i}>
                    <Comment.Avatar src={msg.sender == "Bot" ? robot : user}/>
                    <Comment.Content>
                        <Comment.Author as='a'>{msg.sender}</Comment.Author>
                        <Comment.Metadata>
                            <TimeAgo formatter={this.formatter} date={msg.time}/>
                        </Comment.Metadata>
                        <Comment.Text style={{whiteSpace: 'pre-line'}}>{msg.message}</Comment.Text>
                    </Comment.Content>
                </Comment>
            )
        });

        return (
            <Container>
                <Comment.Group>
                    <Header as='h3' dividing className={"chatbot-header"}>
                        Chatbot
                        <Checkbox toggle label={"Kanye mode"} style={{float: "right"}}
                                  checked={this.state.kanyeMode}
                                  onChange={(event1, data) => this.setState({kanyeMode: !!data.checked})}/>
                    </Header>

                    <div style={{overflowY: 'auto', maxHeight: '60vh'}} ref={this.commentsRef}>{messages}</div>
                    {messages.length == 0 && <p>Keine Nachrichten</p>}

                    <Form>
                        <Form.Field>
                            <label>Nachricht</label>
                            <input placeholder='Nachricht' value={this.state.input}
                                   onChange={event1 => this.setState({input: event1.currentTarget.value})}
                                   onKeyDown={this.keyHit}
                                   ref={this.inputRef} disabled={this.state.sending}/>
                        </Form.Field>
                        <Button type='submit' onClick={this.sendMessage}>Senden</Button>
                    </Form>
                </Comment.Group>
            </Container>
        );
    }
}

export default App;
