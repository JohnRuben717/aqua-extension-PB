import ids from './versionData.json';

async function fetchBook() {
    for (const revision of ids) {
        const { id, name } = revision;
        console.log(name);
    }
}


fetchBook()