const mapOutboundRefs = (ref) => {
  if (ref.parent.fields && ref.parent.fields.title) {
    return {
      mdx: ref.body,
      title: ref.parent.fields.title,
      id: ref.parent.id,
      displayTitle: ref.parent.fields.title,
      slug: ref.parent.fields.slug,
      aliases: (ref.frontmatter || {}).aliases || [],
    };
  }
  console.warn(`Cannot map outbound ref`, ref);
  return null;
};

const mapInboundRefs = (ref) => {
  if (ref.parent.fields && ref.parent.fields.title) {
    return {
      content: null,
      title: ref.parent.fields.title,
      id: ref.parent.id,
      slug: ref.parent.fields.slug,
      aliases: (ref.frontmatter || {}).aliases || [],
    };
  }

  console.warn(`Cannot map inbound ref`, ref);
  return null;
};

export const dataToNote = (data) => ({
  title: data.file.fields.title,
  mdx: data.file.childMdx.body,
  headings: data.file.childMdx.headings,
  outboundReferences: data.file.childMdx.outboundReferences
    .map(mapOutboundRefs)
    .filter((x) => !!x),
  inboundReferences: data.file.childMdx.inboundReferences
    .map(mapInboundRefs)
    .filter((x) => !!x),
});
