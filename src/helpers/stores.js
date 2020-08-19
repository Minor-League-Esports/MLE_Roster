import {writable} from "svelte/store";

export const ballchasingApiKey = writable(JSON.parse(localStorage.getItem("ballchasingApiKey")) || false);
ballchasingApiKey.subscribe(val => localStorage.setItem("ballchasingApiKey", JSON.stringify(val)));

