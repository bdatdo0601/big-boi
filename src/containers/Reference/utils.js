import { has, set, get, last, capitalize } from "lodash";

export const convertToReferenceRenderedData = data =>
  data.reduce(
    (acc, currentItem) => {
      const { tags } = currentItem;
      if (tags.length === 0) {
        acc.children.Tagless.references.push(currentItem);
        return acc;
      }
      tags.forEach(tag => {
        const tagSplitted = tag.split(".");
        tagSplitted.reduce((tagSplittedAcc, currentSplit) => {
          tagSplittedAcc.push(capitalize(currentSplit));
          const rawPath = `children.${tagSplittedAcc.join(".children.")}`;
          if (!has(acc, rawPath)) {
            set(acc, rawPath, {
              name: last(tagSplittedAcc),
              references: [],
              path: tagSplittedAcc.join("."),
              rawPath,
              children: {},
            });
          }
          return tagSplittedAcc;
        }, []);
        const tagPath = `children.${tag.split(".").join(".children.")}`;
        get(acc, tagPath).references.push(currentItem);
      });
      return acc;
    },
    {
      children: {
        Tagless: { name: "Tagless", references: [], path: "Tagless", children: {} },
      },
    }
  );

export default {
  convertToReferenceRenderedData,
};
