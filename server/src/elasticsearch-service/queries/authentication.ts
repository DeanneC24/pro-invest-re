import { Client } from "@elastic/elasticsearch"

const checkIndexExists = async (client: Client, indexName: string ) => {
    try {
        const response = await client.indices.exists({ index: indexName });
        console.log(`Index ${indexName} exists? ${response}`)
        return response;
    } catch (error) {
        console.error(`Error checking index ${indexName} existence: ${error}`);
        return false;
    }
}

const getUser = async (client: Client, username: string): Promise<object> => {
    try {
        const response = await client.search({
            index: process.env.ELASTICSEARCH_CREDENTIALS_INDEX,
            body: {
                query: {
                    bool:{
                        must:[
                            {
                                match: {
                                    username: username
                                }
                            }
                        ]
                    }
                }
            }
        })
        const userExists: boolean = response.hits.hits.length === 1 ? true : false
        if (!userExists) {
            console.warn(`User ${username} doesn't exist`)
            return {}
        } else {
            console.log(`Successfully retrieved user ${username}`)
            return response.hits.hits[0]['_source'] as object
        }
    } catch (err) {
        console.error(`Issue retrieving user ${username} from data store`)
        throw err
    }
}

export { getUser, checkIndexExists }  