/* All of the containers will need similar constants, so share from this file */
export const FETCH_INCREMENT = 25;
export const KBS_ENDPOINT = 'erm/kbs';
export const REFDATA_ENDPOINT = 'erm/refdata';
export const ERESOURCES_ELECTRONIC_ENDPOINT = 'erm/resource/electronic';
export const PACKAGES_ENDPOINT = 'erm/packages';
export const TITLES_ENDPOINT = 'erm/titles/electronic';

export const [
  AVAILABILITY_CONSTRAINT,
  CONTENT_TYPE,
  LIFECYCLE_STATUS,
  PUB_TYPE,
  SCOPE,
  TYPE
] = [
  'AvailabilityConstraint.Body',
  'ContentType.ContentType',
  'Pkg.LifecycleStatus',
  'TitleInstance.PublicationType',
  'Pkg.AvailabilityScope',
  'TitleInstance.Type',
];
