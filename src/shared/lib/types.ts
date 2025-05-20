export interface UseCaseActorInfo {
  actorId: string;
}

type JSONObject = {
  [key: string]: string | number | boolean | null | JSONObject | JSONArray;
};

type JSONArray = (string | number | boolean | null | JSONObject | JSONArray)[];

export type { JSONObject, JSONArray };
