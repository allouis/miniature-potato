import { container, delay } from "tsyringe";

export function register(token: string, path: string) {
    container.register(token, {
        useClass: delay(() => require(path).default)
    });
}