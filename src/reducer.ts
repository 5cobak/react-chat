type LoginAction =  {
	type: string,
	payload: {
		room: string;
		user: string;
	}
}

type setMessageAction = {
	type: string,
	payload: {
		users: string[];
		messages: string[];
	}
}

type reducerAction = LoginAction | setMessageAction;

type State = {
	room: string
	user: string
	messages: {user: string, message: string}[] | [],
	users: string[] | []
}

const initState: State = {
	room: '', 
	user: '', 
	messages: [],
	users: []
};

const reducer = (state = initState, action: reducerAction) => {
	switch (action.type) {
		case 'LOG_IN':
			if ("user" in action.payload) {
				return {...state, 
					room: action.payload.room,
					user: action.payload.user
				}
			}
			return state;
		case 'LOG_OUT': 
			if("user" in action.payload) {
				return {
					...state, 
					room: '',
					user: ''
				}
			}
			return state;
		case 'SET_ROOM_DATA':
			if ("users" in action.payload) {
				return {
					...state, 
					users: action.payload.users,
				}
			}
			return state;
		default:
			return state;
	}
}
export type { LoginAction, setMessageAction, State};
export {reducer, initState};