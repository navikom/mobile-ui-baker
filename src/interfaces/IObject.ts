export interface IObject {
 readonly parent: string;
 items: Map<string, IObject | string | number | Date | null>;
 keys: string[];
 hasNext(key: string): boolean;
}
