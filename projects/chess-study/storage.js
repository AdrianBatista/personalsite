const DATABASE_NAME = "afnb-chess-study";
const DATABASE_VERSION = 1;
const STORE_NAME = "sessions";
const ACTIVE_SESSION_KEY = "active";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is unavailable."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    });

    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

function runTransaction(mode, callback) {
  return openDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        let request;

        try {
          request = callback(store);
        } catch (error) {
          database.close();
          reject(error);
          return;
        }

        transaction.addEventListener("complete", () => {
          database.close();
          resolve(request?.result);
        });
        transaction.addEventListener("error", () => {
          database.close();
          reject(transaction.error);
        });
        transaction.addEventListener("abort", () => {
          database.close();
          reject(transaction.error || new Error("Storage transaction aborted."));
        });
      }),
  );
}

export function loadStoredSession() {
  return runTransaction("readonly", (store) => store.get(ACTIVE_SESSION_KEY));
}

export function saveStoredSession(session) {
  return runTransaction("readwrite", (store) =>
    store.put(session, ACTIVE_SESSION_KEY),
  );
}

export function clearStoredSession() {
  return runTransaction("readwrite", (store) =>
    store.delete(ACTIVE_SESSION_KEY),
  );
}
