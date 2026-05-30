import { resources } from "../i18n";

it("debería tener los mismos namespaces en es y ca", () => {
  expect(Object.keys(resources.es).sort()).toEqual(Object.keys(resources.ca).sort());
});
