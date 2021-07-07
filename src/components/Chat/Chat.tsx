import React from 'react';
import { Scrollbar } from "react-scrollbars-custom";
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

	const chatRef = React.useRef<any>(null);

	const callback = (messagesData: any) => {
		setMessages([
			...messagesData,
			{
				user: state.user,
				message: message
			}
		])
	}

	React.useEffect(()=>{
		fb.getMessages(state.room, callback);
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
		setTimeout(()=>{
			chatRef.current.scrollToBottom();
		})
		
	}

	const handlerInputTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	}

	return (
		<div className={classes.chatWrapper}>
			<div className={classes.sideBar}>
				<h1 className={classes.title}>Комната: {state.room}</h1>
				<h2 className={classes.userName}>Я: {state.user}</h2>
				<ul className={classes.usersList}>
					{state.users.map((user, index)=><li key={user + index}>{user}</li>)}
				</ul>
			</div>
			<div>
				<Scrollbar style={{width: '320px'}} className={classes.chat} ref={chatRef}>
					<ul className={classes.chatList}>
						{messages.map((data, index) => {
							if(data.message && data.user !== state.user) {
								return (
									<li key={data.user + index} className={classes.chatItem}>
										<span className={classes.user}>{data.user}</span>
										<span className={classes.message}>{data.message}</span>
									</li>
								)	
							}
							else if (data.message && data.user === state.user) {
								return (
									<li key={data.user + data.message} className={classes.chatItemCurrent}>
										<span className={classes.currentUser}>{data.user}</span>
										<span className={classes.currentMessage}>{data.message}</span>
									</li>
								)
							}
							else return null;
						})}
					</ul>
					
				</Scrollbar>
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

