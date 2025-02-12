export interface IMapper<IDomain, ISchemaModel, ISchemaCreateInput, IDomainDTO> {
  toDomain(rawData: ISchemaModel): IDomain;
  toPersistence(domain: IDomain): ISchemaCreateInput;
  toDTO(domain: IDomain): IDomainDTO;
}
