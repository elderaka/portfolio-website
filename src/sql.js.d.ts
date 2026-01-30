declare module 'sql.js' {
  export interface Database {
    run(sql: string): void
    exec(sql: string): any[]
  }

  export interface SqlJsStatic {
    Database: new () => Database
  }

  export default function initSqlJs(config?: {
    locateFile?: (filename: string) => string
  }): Promise<SqlJsStatic>
}
