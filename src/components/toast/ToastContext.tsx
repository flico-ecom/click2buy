// toast-context.ts
import {
	createContextId,
	useContextProvider,
	useSignal,
	type Signal,
	useContext,
} from '@builder.io/qwik';

export interface ToastState {
	message: string;
	visible: boolean;
}

export const ToastContext = createContextId<Signal<ToastState>>('toast');

export const useToastProvider = () => {
	const toastSignal = useSignal<ToastState>({ message: '', visible: false });
	useContextProvider(ToastContext, toastSignal);
};

export const useToast = () => useContext(ToastContext);
