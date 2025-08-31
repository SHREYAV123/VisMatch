import { IProduct } from '../models/Product';
export declare class DataService {
    private static isConnected;
    private static connect;
    static find(filter?: any): Promise<IProduct[]>;
    static countDocuments(): Promise<number>;
    static distinct(field: string): Promise<string[]>;
    static findById(id: string): Promise<IProduct | null>;
    static getAllProducts(): Promise<IProduct[]>;
}
export default DataService;
//# sourceMappingURL=dataService.d.ts.map