import { writable } from "svelte/store";

export const modalStore = writable({
    visible: false,
    title: '',
    children: null,
    dialogReason: () => {},
    acceptBtnText: '',
    cancelBtnText: '',
    showOverlay: true,
    cancelOnOverlayClick: true
});