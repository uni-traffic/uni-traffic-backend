export interface IMapper<IDomain, IPersistenceModel, IDomainDTO> {
  toDomain(rawData: IPersistenceModel): IDomain;
  toPersistence(domain: IDomain): IPersistenceModel;
  toDTO(domain: IDomain): IDomainDTO;
}
