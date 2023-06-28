import { z } from "zod";
import { Service, Worker_Binding } from "../../runtime";
import {
  PersistenceSchema,
  Plugin,
  namespaceEntries,
  pluginNamespacePersistWorker,
} from "../shared";
import { ConstellationGateway } from "./gateway";
import { ConstellationRouter } from "./router";

export const ConstellationOptionsSchema = z.object({
  constellationProjects: z
    .union([z.record(z.string()), z.string().array()])
    .optional(),
});
export const ConstellationSharedOptionsSchema = z.object({
  constellationPersist: PersistenceSchema,
});

export const CONSTELLATION_PLUGIN_NAME = "constellation";
const SERVICE_PROJECT_PREFIX = `${CONSTELLATION_PLUGIN_NAME}:project`;

export const CONSTELLATION_PLUGIN: Plugin<
  typeof ConstellationOptionsSchema,
  typeof ConstellationSharedOptionsSchema,
  ConstellationGateway
> = {
  gateway: ConstellationGateway,
  router: ConstellationRouter,
  options: ConstellationOptionsSchema,
  sharedOptions: ConstellationSharedOptionsSchema,
  getBindings(options) {
    const projects = namespaceEntries(options.constellationProjects);
    return projects.map<Worker_Binding>(([name, id]) => ({
      name,
      service: { name: `${SERVICE_PROJECT_PREFIX}:${id}` },
    }));
  },
  getServices({ options, sharedOptions }) {
    const persist = sharedOptions.constellationPersist;
    const projects = namespaceEntries(options.constellationProjects);
    return projects.map<Service>(([_, id]) => ({
      name: `${SERVICE_PROJECT_PREFIX}:${id}`,
      worker: pluginNamespacePersistWorker(
        CONSTELLATION_PLUGIN_NAME,
        encodeURIComponent(id),
        persist
      ),
    }));
  },
};

export * from "./gateway";
