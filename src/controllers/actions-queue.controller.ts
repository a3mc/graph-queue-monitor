import { get, param, response } from '@loopback/rest';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
export class ActionsQueueController {
    constructor() {
    }

    @get( '/actions-queue' )
    @response( 200 )
    async queue(
        @param.query.number( 'limit' ) limit: number = 50,
    ): Promise<any> {
        // Get actions queue from the database
        // Todo: move this to a service
        const pool = new Pool( {
            user: process.env.INDEXER_AGENT_POSTGRES_USERNAME,
            host: process.env.INDEXER_AGENT_POSTGRES_HOST,
            database: process.env.INDEXER_AGENT_POSTGRES_DATABASE,
            password: process.env.INDEXER_AGENT_POSTGRES_PASSWORD,
            // @ts-ignore
            port: parseInt( process.env.INDEXER_AGENT_POSTGRES_PORT ),
        });
        const queue = await pool.query(
            "SELECT t.* FROM public.\"Actions\" t ORDER BY id DESC LIMIT " + limit
        );
        await pool.end();
        return queue.rows;
    }
}
