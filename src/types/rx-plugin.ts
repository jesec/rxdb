export interface RxPlugin {
    readonly rxdb: true;
    prototypes?: {
        RxSchema?: Function,
        Crypter?: Function,
        RxDocument?: Function,
        RxQuery?: Function,
        RxCollection?: Function,
        RxDatabase?: Function
    };
    overwritable?: {
        isDevMove?: () => boolean;
        validatePassword?: Function,
        createKeyCompressor?: Function,
        checkAdapter?: Function,
        tunnelErrorMessage?: Function
    };
    hooks?: {
        createRxDatabase?: Function,
        preDestroyRxDatabase?: Function,
        createRxCollection?: Function,
        preCreateRxCollection?: Function,
        preCreateRxSchema?: Function,
        createRxSchema?: Function,
        createRxQuery?: Function,
        createRxDocument?: Function,
        postCreateRxDocument?: Function,
        preCreatePouchDb?: Function,
        preMigrateDocument?: Function,
        postMigrateDocument?: Function
    };
}
