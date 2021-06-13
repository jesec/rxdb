import clone from 'clone';
import * as schemas from './schemas';
import * as schemaObjects from './schema-objects';

import {
    createRxDatabase,
    RxJsonSchema,
    RxCollection,
    RxDatabase,
    randomCouchString
} from '../../plugins/core';

import {
    PouchDB,
    getRxStoragePouch
} from '../../plugins/pouchdb';


import {
    HumanDocumentType
} from './schema-objects';
import { MigrationStrategies } from '../../src/types';

export async function create(
    size: number = 20,
    name: string = 'human',
    multiInstance: boolean = true
): Promise<RxCollection<HumanDocumentType, {}, {}>> {
    if (!name) {
        name = 'human';
    }
    PouchDB.plugin(require('pouchdb-adapter-memory'));
    const db = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.HumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        multiInstance,
        eventReduce: true,
        ignoreDuplicate: true
    });

    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name,
        schema: schemas.human
    });

    // insert data
    if (size > 0) {
        const docsData = new Array(size)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);
    }
    return collection;
}

export async function createBySchema<RxDocumentType = {}>(
    schema: RxJsonSchema<RxDocumentType>,
    name = 'human'
): Promise<RxCollection<RxDocumentType, {}, {}>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { [prop: string]: RxCollection<RxDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        multiInstance: true,
        eventReduce: true,
        ignoreDuplicate: true
    });

    const collection = await db.collection<RxDocumentType>({
        name,
        schema
    });

    return collection;
}

export async function createAttachments(
    size = 20,
    name = 'human',
    multiInstance = true
): Promise<RxCollection<schemaObjects.HumanDocumentType, {}, {}>> {

    if (!name) name = 'human';
    PouchDB.plugin(require('pouchdb-adapter-memory'));
    const db = await createRxDatabase<any, any, { [prop: string]: RxCollection<schemaObjects.HumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        multiInstance,
        eventReduce: true,
        ignoreDuplicate: true
    });

    const schemaJson = clone(schemas.human);
    schemaJson.attachments = {};

    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name,
        schema: schemaJson
    });

    // insert data
    if (size > 0) {
        const docsData = new Array(size)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createEncryptedAttachments(
    size = 20,
    name = 'human',
    multiInstance = true
): Promise<RxCollection<schemaObjects.HumanDocumentType, {}, {}>> {

    if (!name) name = 'human';
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { [prop: string]: RxCollection<schemaObjects.HumanDocumentType> }>({
        name: randomCouchString(10),
        password: 'foooooobaaaar',
        storage: getRxStoragePouch('memory'),
        multiInstance,
        eventReduce: true,
        ignoreDuplicate: true
    });

    const schemaJson = clone(schemas.human);
    schemaJson.attachments = {
        encrypted: true
    };

    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name,
        schema: schemaJson
    });

    // insert data
    if (size > 0) {
        const docsData = new Array(size)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createNoCompression(
    size = 20,
    name = 'human'
): Promise<RxCollection<schemaObjects.HumanDocumentType>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { [prop: string]: RxCollection<schemaObjects.HumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    const schemaJSON = clone(schemas.human);
    schemaJSON.keyCompression = false;
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name,
        schema: schemaJSON
    });

    // insert data
    if (size > 0) {
        const docsData = new Array(size)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createAgeIndex(
    amount = 20
): Promise<RxCollection<schemaObjects.HumanDocumentType>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { humana: RxCollection<schemaObjects.HumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name: 'humana',
        schema: schemas.humanAgeIndex
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function multipleOnSameDB(
    size = 10
): Promise<{
    db: RxDatabase<{
        human: RxCollection<schemaObjects.HumanDocumentType>;
        human2: RxCollection<schemaObjects.HumanDocumentType>;
    }>,
    collection: RxCollection<schemaObjects.HumanDocumentType>
    collection2: RxCollection<schemaObjects.HumanDocumentType>
}> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, {
        human: RxCollection<schemaObjects.HumanDocumentType>,
        human2: RxCollection<schemaObjects.HumanDocumentType>
    }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name: 'human',
        schema: schemas.human
    });
    const collection2 = await db.collection<schemaObjects.HumanDocumentType>({
        name: 'human2',
        schema: schemas.human
    });

    // insert data
    if (size > 0) {
        const docsData = new Array(size)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);

        const docsData2 = new Array(size)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection2.bulkInsert(docsData2);
    }

    return {
        db,
        collection,
        collection2
    };
}

export async function createNested(
    amount = 5,
    adapter = 'memory'
): Promise<RxCollection<schemaObjects.NestedHumanDocumentType>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { nestedhuman: RxCollection<schemaObjects.NestedHumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.NestedHumanDocumentType>({
        name: 'nestedhuman',
        schema: schemas.nestedHuman
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.nestedHuman());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createDeepNested(
    amount = 5,
    adapter = 'memory'
): Promise<RxCollection<schemaObjects.DeepNestedHumanDocumentType>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { nestedhuman: RxCollection<schemaObjects.DeepNestedHumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.DeepNestedHumanDocumentType>({
        name: 'nestedhuman',
        schema: schemas.deepNestedHuman
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.deepNestedHuman());
        await collection.bulkInsert(docsData);
    }


    return collection;
}

export async function createEncrypted(
    amount: number = 10
): Promise<RxCollection<schemaObjects.EncryptedHumanDocumentType>> {

    const db = await createRxDatabase<any, any, { encryptedhuman: RxCollection<schemaObjects.EncryptedHumanDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        password: randomCouchString(10)
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.EncryptedHumanDocumentType>({
        name: 'encryptedhuman',
        schema: schemas.encryptedHuman
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.encryptedHuman());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createMultiInstance(
    name: string,
    amount = 0,
    password = null
): Promise<RxCollection<schemaObjects.HumanDocumentType, {}, {}>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.HumanDocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        password,
        multiInstance: true,
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.HumanDocumentType>({
        name: 'human',
        schema: schemas.human
    });
    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.human());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createPrimary(
    amount = 10,
    name = randomCouchString(10)
): Promise<RxCollection<schemaObjects.SimpleHumanDocumentType>> {

    const db = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.SimpleHumanDocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        multiInstance: true,
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.SimpleHumanDocumentType>({
        name: 'human',
        schema: schemas.primaryHuman
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.simpleHuman());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createHumanWithTimestamp(
    amount = 0,
    name = randomCouchString(10)
): Promise<RxCollection<schemaObjects.HumanWithTimestampDocumentType>> {

    const db = await createRxDatabase<any, any, { humans: RxCollection<schemaObjects.HumanWithTimestampDocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        multiInstance: true,
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.HumanWithTimestampDocumentType>({
        name: 'humans',
        schema: schemas.humanWithTimestamp
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.humanWithTimestamp());
        await collection.bulkInsert(docsData);
    }

    return collection;
}

export async function createMigrationCollection(
    amount = 0,
    addMigrationStrategies: MigrationStrategies = {},
    name = randomCouchString(10),
    autoMigrate = false
): Promise<RxCollection<schemaObjects.SimpleHumanV3DocumentType>> {

    const migrationStrategies: any = {
        1: (doc: any) => doc,
        2: (doc: any) => doc,
        3: (doc: any) => doc
    };

    Object.entries(addMigrationStrategies)
        .forEach(([prop, fun]) => {
            migrationStrategies[prop] = fun;
        });

    const colName = 'human';
    const db = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.SimpleHumanAgeDocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    const col = await db.collection<schemaObjects.SimpleHumanAgeDocumentType>({
        name: colName,
        schema: schemas.simpleHuman,
        autoMigrate: false
    });

    await Promise.all(
        new Array(amount)
            .fill(0)
            .map(() => col.insert(schemaObjects.simpleHumanAge()))
    );

    col.destroy();
    db.destroy();

    const db2 = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.SimpleHumanV3DocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    const col2 = await db2.collection<schemaObjects.SimpleHumanV3DocumentType>({
        name: colName,
        schema: schemas.simpleHumanV3,
        autoMigrate,
        migrationStrategies
    });

    return col2;
}

export async function createRelated(
    name = randomCouchString(10)
): Promise<RxCollection<schemaObjects.RefHumanDocumentType>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.RefHumanDocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        multiInstance: true,
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.RefHumanDocumentType>({
        name: 'human',
        schema: schemas.refHuman
    });

    const doc1 = schemaObjects.refHuman();
    const doc2 = schemaObjects.refHuman(doc1.name);
    doc1.bestFriend = doc2.name; // cross-relation

    await collection.insert(doc1);
    await collection.insert(doc2);

    return collection;
}

export async function createRelatedNested(
    name = randomCouchString(10)
): Promise<RxCollection<schemaObjects.RefHumanNestedDocumentType>> {

    const db = await createRxDatabase<any, any, { human: RxCollection<schemaObjects.RefHumanNestedDocumentType> }>({
        name,
        storage: getRxStoragePouch('memory'),
        multiInstance: true,
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.RefHumanNestedDocumentType>({
        name: 'human',
        schema: schemas.refHumanNested
    });

    const doc1 = schemaObjects.refHumanNested();
    const doc2 = schemaObjects.refHumanNested(doc1.name);
    doc1.foo.bestFriend = doc2.name; // cross-relation

    await collection.insert(doc1);
    await collection.insert(doc2);

    return collection;
}

export async function createIdAndAgeIndex(
    amount = 20
): Promise<RxCollection<schemaObjects.HumanWithIdAndAgeIndexDocumentType>> {
    PouchDB.plugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<any, any, { humana: RxCollection<schemaObjects.HumanWithIdAndAgeIndexDocumentType> }>({
        name: randomCouchString(10),
        storage: getRxStoragePouch('memory'),
        eventReduce: true,
        ignoreDuplicate: true
    });
    // setTimeout(() => db.destroy(), dbLifetime);
    const collection = await db.collection<schemaObjects.HumanWithIdAndAgeIndexDocumentType>({
        name: 'humana',
        schema: schemas.humanIdAndAgeIndex
    });

    // insert data
    if (amount > 0) {
        const docsData = new Array(amount)
            .fill(0)
            .map(() => schemaObjects.humanWithIdAndAgeIndexDocumentType());
        await collection.bulkInsert(docsData);
    }

    return collection;
}
