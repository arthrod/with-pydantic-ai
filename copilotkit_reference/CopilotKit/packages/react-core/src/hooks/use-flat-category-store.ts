import { useCallback, useReducer } from "react";
import { randomId } from "@copilotkit/shared";

export type FlatCategoryStoreId = string;

export interface UseFlatCategoryStoreReturn<T> {
  addElement: (value: T, categories: string[]) => FlatCategoryStoreId;
  removeElement: (id: FlatCategoryStoreId) => void;
  allElements: (categories: string[]) => T[];
}

interface FlatCategoryStoreElement<T> {
  id: FlatCategoryStoreId;
  value: T;
  categories: Set<string>;
}

const useFlatCategoryStore = <T>(): UseFlatCategoryStoreReturn<T> => {
  const [elements, dispatch] = useReducer<
    React.Reducer<Map<FlatCategoryStoreId, FlatCategoryStoreElement<T>>, Action<T>>
  >(flatCategoryStoreReducer, new Map<FlatCategoryStoreId, FlatCategoryStoreElement<T>>());

  const addElement = useCallback((value: T, categories: string[]): FlatCategoryStoreId => {
    const newId = randomId();
    dispatch({
      type: "ADD_ELEMENT",
      value,
      id: newId,
      categories,
    });
    return newId;
  }, []);

  const removeElement = useCallback((id: FlatCategoryStoreId): void => {
    dispatch({ type: "REMOVE_ELEMENT", id });
  }, []);

  const allElements = useCallback(
    (categories: string[]): T[] => {
      const categoriesSet = new Set(categories);
      const result: T[] = [];
      elements.forEach((element) => {
        if (setsHaveIntersection(categoriesSet, element.categories)) {
          result.push(element.value);
        }
      });
      return result;
    },
    [elements],
  );

  return { addElement, removeElement, allElements };
};

export default useFlatCategoryStore;

// Action types
type Action<T> =
  | {
      type: "ADD_ELEMENT";
      value: T;
      id: FlatCategoryStoreId;
      categories: string[];
    }
  | { type: "REMOVE_ELEMENT"; id: FlatCategoryStoreId };

/**
 * Applies an add or remove action to the flat category store and returns the resulting map.
 *
 * @param state - Current map of stored elements keyed by id
 * @param action - Action to apply; supported types are `ADD_ELEMENT` and `REMOVE_ELEMENT`
 * @returns A new map reflecting the applied action, or the original `state` if the action type is unrecognized
 */
function flatCategoryStoreReducer<T>(
  state: Map<FlatCategoryStoreId, FlatCategoryStoreElement<T>>,
  action: Action<T>,
): Map<FlatCategoryStoreId, FlatCategoryStoreElement<T>> {
  switch (action.type) {
    case "ADD_ELEMENT": {
      const { value, id, categories } = action;
      const newElement: FlatCategoryStoreElement<T> = {
        id,
        value,
        categories: new Set(categories),
      };
      const newState = new Map(state);
      newState.set(id, newElement);
      return newState;
    }
    case "REMOVE_ELEMENT": {
      const newState = new Map(state);
      newState.delete(action.id);
      return newState;
    }
    default:
      return state;
  }
}

/**
 * Determines whether two sets share at least one element.
 *
 * @param setA - The first set to compare
 * @param setB - The second set to compare
 * @returns `true` if the sets have any element in common, `false` otherwise
 */
function setsHaveIntersection<T>(setA: Set<T>, setB: Set<T>): boolean {
  const [smallerSet, largerSet] = setA.size <= setB.size ? [setA, setB] : [setB, setA];

  for (let item of smallerSet) {
    if (largerSet.has(item)) {
      return true;
    }
  }

  return false;
}