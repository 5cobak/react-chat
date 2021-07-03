import React from 'react';
import { fb } from '../../firebase';
import { setMessageAction, State } from '../../reducer';
import classes from './Chat.module.scss';

type ChatProps = {
	state: State;
	dispatch: React.Dispatch<setMessageAction>
}

const Chat = ({state, dispatch}: ChatProps) => {
	const [message, setMessage] = React.useState('');

	const [messages, setMessages] = React.useState<{user?: any, message?: any}[]>([{}]);

	const callback = (messagesData: any) => {
		console.log(messagesData);
		
		setMessages([
			...messagesData,
			{
				user: state.user,
				message: message
			}
		])
	}

	React.useEffect(()=>{
		fb.getMessages(state.room, callback)
	},[])

	const handlerClickButton = () => {
		if (!message) return;
		setMessages([
			...messages,
			{
				user: state.user,
				message: message
			}
		])
		fb.setMessages(state.room, state.user, message);
		setMessage('');
	}

	const handlerInputTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	}

	React.useEffect(()=> {
		// setMessage()
	},[])

	React.useEffect(()=> {
		if(!state.room) return;
		window.onbeforeunload = () => {
			fb.deleteUser(state.room, state.user)
		}
	})

	return (
		<div className={classes.chatWrapper}>
			<div className={classes.sideBar}>
				<h1 className={classes.title}>Комната: {state.room}</h1>
				<h2>Я: {state.user}</h2>
				<span>Участники: </span>
				<ul>
					{state.users.map((user, index)=><li key={user + index}>{user}</li>)}
				</ul>
			</div>
			<div>
				<div className={classes.chat}>
					<ul className={classes.chatList}>
						{messages.map((data) => {
							if(data.message) {
								return (
									<li key={data.user + data.message} className={classes.chatItem}>
										<span className={classes.user}>{data.user}</span>
										<span className={classes.message}>{data.message}</span>
									</li>
								)
							}
							else return null;
						})}
					</ul>
					
				</div>
				<textarea 
					className={classes.textArea}
					value={message}
					placeholder="Введите сообщение"
					onChange={handlerInputTextArea}	
				>

				</textarea>
				<button 
					onClick={handlerClickButton} 
					className="button" type="button">
					Отправить сообщение
				</button>
			</div>
		</div>
	)
}

export default Chat;

