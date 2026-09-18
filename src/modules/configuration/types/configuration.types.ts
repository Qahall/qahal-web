export interface ConfigurationBase {
  nombre: string;
}

export interface ConfigurationCreate extends ConfigurationBase {}

export interface ConfigurationResponse extends ConfigurationBase {
  id: number;
}