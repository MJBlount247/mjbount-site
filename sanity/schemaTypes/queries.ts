const projectCardFields = `
  _id,
  title,
  "slug": slug.current,
  client,
  description,
  mainImage,
  tags
`;

export const homeProjectsQuery = `
  *[_type == "project" && defined(slug.current)] | order(completedAt desc)[0...3]{
    ${projectCardFields}
  }
`;

export const projectsArchiveQuery = `
  *[_type == "project" && defined(slug.current)] | order(completedAt desc){
    ${projectCardFields},
    completedAt,
    projectUrl{
      label,
      url
    }
  }
`;

export const projectSlugsQuery = `
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    client,
    description,
    mainImage,
    tags,
    body[]{
      ...,
      _type == "imageBlock" => {
        ...,
        alt,
        asset
      },
      _type == "projectTextBlock" => {
        ...,
        heading,
        body
      },
      _type == "projectAccordionTextBlock" => {
        ...,
        heading,
        headingBackgroundColor,
        body,
        openByDefault
      }
    },
    projectUrl{
      label,
      url
    },
    completedAt
  }
`;

export const postsArchiveQuery = `
  *[_type == "post" && defined(slug.current)] | order(date desc, publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    category,
    date,
    publishedAt
  }
`;

export const postSlugsQuery = `
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    category,
    date,
    publishedAt,
    content[]{
      ...,
      _type == "imageBlock" => {
        ...,
        alt,
        asset
      },
      _type == "textBlock" => {
        ...,
        heading,
        body
      }
    }
  }
`;

export const customTemplateQuery = `
  *[_type == "page" && slug.current == "template"][0]{
    _id,
    title,
    "slug": slug.current,
    pageType,
    seo,
    pageBuilder[]{
      ...,
      _type == "heroBlock" => {
        ...,
        primaryCta,
        secondaryCta,
        image{
          ...,
          asset->
        }
      },
      _type == "ctaBlock" => {
        ...,
        cta
      },
      _type == "recentProjectsBlock" => {
        ...
      },
      _type == "recentPostsBlock" => {
        ...
      },
      _type == "twoColumnBlock" => {
        ...,
        leftImage{
          ...,
          asset->
        },
        rightImage{
          ...,
          asset->
        }
      }
    }
  }
`;
