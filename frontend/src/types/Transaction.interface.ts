export interface ITransaction {
    id: number;
    userId: string;   
    familyId: string;
    amount: number;
    category: string;
    createdAt: string | Date;
}