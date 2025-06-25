interface Specification {
  key: string;
  value: string;
}

export interface SpecificationGroup {
  name: string;
  specifications: Specification[];
}
