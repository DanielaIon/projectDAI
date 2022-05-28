import { useModals } from "@mantine/modals";
import { useEffect } from "react";
import { User } from "../models/user";
import { Auth } from "./Auth";

export type AuthCheckProps = {
    user: User | null;
}

export function AuthCheck(props: AuthCheckProps) {
    const modals = useModals();

    useEffect(() => {
        if (!props.user) {
            modals.openModal({
                title: 'Authenticate',
                overlayOpacity: 1,
                overlayColor: '#ebebeb',
                transitionDuration: 300,
                closeOnClickOutside: false,
                closeOnEscape: false,
                withCloseButton: false,
                children: (
                    <Auth />
                ),
            });
        }
    }, [])
    
    return (<></>);
}