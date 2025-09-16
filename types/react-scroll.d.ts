declare module 'react-scroll' {
    import { ComponentType } from 'react';
    
    interface ScrollProps {
        to: string;
        smooth?: boolean;
        duration?: number;
        offset?: number;
        className?: string;
        children?: React.ReactNode;
        onClick?: () => void;
        delay?: number;
    }
    
    export const Link: ComponentType<ScrollProps>;
}