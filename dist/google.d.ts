declare class Google {
    constructor();
    recognize_google(language: string, priorityFilter: number): Promise<string>;
}
export { Google };
