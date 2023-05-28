import React, { useReducer } from "react"

// choices
type AppChoices = "new_user" | "close" | "new_task" | "new_message" | null | "delete_user" | "update_user" | "block_user" |    "unblock_user" | "make_admin" | "remove_admin"

// initial state
type ChoiceState = AppChoices

const initialState: ChoiceState = null

export enum AppChoiceActions {
    new_user = "new_user",
    new_task = "new_task",
    new_message = "new_message",
    delete_user = "delete_user",
    update_user = "update_user",
    block_user = "block_user",
    unblock_user = "unblock_user",
    make_admin = "make_admin",
    remove_admin = "remove_admin",
    close = "close"
}

type Action = {
    type: AppChoiceActions
}

// reducer
function reducer(state: ChoiceState, action: Action) {
    let type = action.type
    switch (type) {
        //category dialog choices
        case AppChoiceActions.new_user: return type
        case AppChoiceActions.new_task: return type
        case AppChoiceActions.new_message: return type
        case AppChoiceActions.delete_user: return type
        case AppChoiceActions.update_user: return type
        case AppChoiceActions.remove_admin: return type
        case AppChoiceActions.make_admin: return type
        case AppChoiceActions.block_user: return type
        case AppChoiceActions.unblock_user: return type
        case AppChoiceActions.close: return type
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