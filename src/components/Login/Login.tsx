import React from 'react';
import { fb, RoomData } from '../../firebase';

import { State } from '../../reducer';

import classes from './Login.module.scss';

interface ILogin {
	state: State;
	dispatch: React.Dispatch<any>
}

const Login = ({state, dispatch}: ILogin) => {
	const [room, setRoom] = React.useState('');
	const [user, setUser] = React.useState('');
	const [error, setError] = React.useState(false);
	
	const handlerClickButton = () => {
		const errorData = user === '' || room === '';

		if (errorData) {
			setError(true);
			return;
		}
		setError(false);

		dispatch({
			type: 'LOG_IN',
			payload: {
				room,
				user,
			}
		})

		fb.getRoomData(room, (data: RoomData)=>{
			dispatch({
				type: 'SET_ROOM_DATA',
				payload: data
			})	
		});
	}

	const handlerInputRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRoom(e.target.value.trim());
	}

	const handlerInputUser = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser(e.target.value.trim());
	}

	return (
		<form className={classes.form}>
			<h1>Войти в комнату</h1>
			<hr />
			<div className={classes.inputWrapper}>
				<input onChange={handlerInputRoom} type="text" placeholder="Комната" className={classes.input}/>
			</div>
			
			<div className={classes.inputWrapper}>
				<input onChange={handlerInputUser} type="text" placeholder="Имя" className={classes.input}/>
			</div>
			{error ? <span className={classes.error}>Введите корректные данные</span> : null}
			<button onClick={handlerClickButton} type="button" className="button">
				Войти
			</button>
		</form>
	)
}

export default Login;