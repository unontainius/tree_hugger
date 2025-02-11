declare module '*.svg' {
    const content: string;
    export default content;
}

// Declare valid icon names
type IconName = 
    | 'add'
    | 'home'
    | 'search'
    | 'login'
    | 'logout'
    | 'info'
    | 'blank'
    | 'add-new'
    | 'contact'
    | 'close'
    | 'minimize'
    | 'maximize'
    | 'maximize-x'
    | 'sort-asc'
    | 'sort-desc'
    | 'people'
    | 'exclamation'
    | 'open-file'
    | 'download'
    | 'no-image'
    | 'bomb'
    | 'x'
    | 'tick-2'
    | 'locked'; 