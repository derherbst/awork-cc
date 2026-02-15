export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Picture {
  medium: string;
  large: string;
  thumbnail: string;
}

export interface DateOfBirth {
  age: number;
  date: string;
}

export interface DatOfRegistration {
  age: number;
  date: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  postcode: string | number;
  street: {
    number: number;
    name: string;
  };
  coordinates: {
    latitude: string;
    longitude: string;
  };
  timezone: {
    offset: string;
    description: string;
  };
}
export interface UserResult {
  name: Name;
  email: string;
  phone: string;
  picture: Picture;
  nat: string;
  gender: string;
  dob: DateOfBirth;
  registered: DatOfRegistration;
  location: Location;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
}

export interface Info {
  seed: string;
  results: number;
  page: number;
}

export interface ApiResult {
  results: UserResult[];
  info: Info;
}
