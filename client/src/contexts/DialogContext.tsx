import React, { useReducer } from "react"

// choices
type AppChoices = "new_user" | "close" | "new_task" | "new_message" | null | "delete_user" | "update_user" | "block_user" |    "unblock_user" | "make_admin" | "remove_admin"

type TaskChoices = "new_task" | "delete_task" | "close"
type MessageChoices = "new_message" | "delete_message" | "close"

// initial state
type ChoiceState = AppChoices | TaskChoices | MessageChoices

const initialState: ChoiceState = null

export enum AppChoiceActions {
    new_user = "new_user",
    new_message = "new_message",
    delete_user = "delete_user",
    update_user = "update_user",
    block_user = "block_user",
    unblock_user = "unblock_user",
    make_admin = "make_admin",
    remove_admin = "remove_admin",
    close = "close"
}
export enum TaskChoiceActions {
    new_task = "new_task",
    delete_task = "delete_task",
    close = "close"
}
export enum MessageChoiceActions {
    new_message = "new_message",
    delete_message = "delete_message",
    close = "close"
}

type Action = {
    type: AppChoiceActions | TaskChoiceActions | MessageChoiceActions
}

// reducer
function reducer(state: ChoiceState, action: Action) {
    let type = action.type
    switch (type) {
        //users dialog choices
        case AppChoiceActions.new_user: return type
        case AppChoiceActions.new_message: return type
        case AppChoiceActions.delete_user: return type
        case AppChoiceActions.update_user: return type
        case AppChoiceActions.remove_admin: return type
        case AppChoiceActions.make_admin: return type
        case AppChoiceActions.block_user: return type
        case AppChoiceActions.unblock_user: return type
        case AppChoiceActions.close: return type

        // task dialog choices
        case TaskChoiceActions.new_task: return type
        case TaskChoiceActions.delete_task: return type
        case TaskChoiceActions.close: return type

        // message dialog choices
        case MessageChoiceActions.new_message: return type
        case MessageChoiceActions.delete_message: return type
        case MessageChoiceActions.close: return type
        default: return state
    }
}
// context
type Context = {
    choice: ChoiceState,
    setChoice: React.Dispatch<Action>
}
export const ChoiceContext = React.createContext<Context>(
    {
        choice: null,
        setChoice: () => null
    }
)
// provider
export function ChoiceProvider(props: { children: JSX.Element }) {
    const [choice, setChoice] = useReducer(reducer, initialState)
    return (
        <ChoiceContext.Provider value={{ choice, setChoice }}>
            {props.children}
        </ChoiceContext.Provider>
    )

}