import type { MathDiagnosticSkill, MathTaxonomy } from "./mathCommandTypes";

export const mathStandardsReferenceUrl = "https://www.nysed.gov/sites/default/files/programs/standards-instruction/nys-next-generation-mathematics-p-12-standards.pdf";

// Domain references were checked against NYSED's published Grade 7/8 standards.
// These are navigation aids, never automatic verified question mappings.
export const mathStandardsReferences = [
  {code:"NY-7.RP",label:"Ratios and proportional relationships",grade:7},
  {code:"NY-7.NS",label:"The number system",grade:7},
  {code:"NY-7.EE",label:"Expressions, equations, and inequalities",grade:7},
  {code:"NY-7.G",label:"Geometry",grade:7},
  {code:"NY-7.SP",label:"Statistics and probability",grade:7},
  {code:"NY-8.NS",label:"The number system",grade:8},
  {code:"NY-8.EE",label:"Expressions, equations, and inequalities",grade:8},
  {code:"NY-8.F",label:"Functions",grade:8},
  {code:"NY-8.G",label:"Geometry",grade:8},
  {code:"NY-8.SP",label:"Statistics and probability",grade:8},
].map(item=>({...item,referenceUrl:mathStandardsReferenceUrl}));

const skill=(id:string,label:string,category:string,subcategory:string,prerequisiteIds:string[]=[]):MathDiagnosticSkill=>({id,label,category,subcategory,prerequisiteIds,standardReferences:[]});

// A manageable starting vocabulary below the existing 23 subtopics. No question
// is assigned a diagnostic skill here. Teachers maintain these definitions and
// prerequisite relationships; links suggest where to inspect evidence only.
export const defaultMathDiagnosticSkills:MathDiagnosticSkill[] = [
  skill("integer-operations","Integer Operations","Arithmetic & Number Sense","Number Operations"),
  skill("order-of-operations","Order of Operations","Arithmetic & Number Sense","Number Operations",["integer-operations"]),
  skill("factors-multiples","Factors and Multiples","Arithmetic & Number Sense","Number Properties"),
  skill("divisibility-primes","Divisibility and Prime Factorization","Arithmetic & Number Sense","Number Properties"),
  skill("fraction-operations","Fraction Operations","Arithmetic & Number Sense","Fractions & Decimals"),
  skill("decimal-operations","Decimal Operations","Arithmetic & Number Sense","Fractions & Decimals"),
  skill("rational-conversions","Fraction and Decimal Conversions","Arithmetic & Number Sense","Fractions & Decimals"),
  skill("exponents-roots","Exponents and Roots","Arithmetic & Number Sense","Exponents, Roots & Scientific Notation"),
  skill("scientific-notation","Scientific Notation","Arithmetic & Number Sense","Exponents, Roots & Scientific Notation",["exponents-roots"]),
  skill("unit-conversions","Unit Conversions","Arithmetic & Number Sense","Units & Conversions"),
  skill("counting-sets","Counting and Set Relationships","Arithmetic & Number Sense","Counting & Sets"),
  skill("distributive-property","Distributive Property","Algebra","Algebraic Expressions",["integer-operations"]),
  skill("combining-like-terms","Combining Like Terms","Algebra","Algebraic Expressions",["integer-operations"]),
  skill("evaluate-expressions","Evaluate Expressions","Algebra","Algebraic Expressions",["order-of-operations"]),
  skill("one-step-equations","One-Step Equations","Algebra","Equations & Systems",["integer-operations"]),
  skill("linear-equations","Linear Equations","Algebra","Equations & Systems",["one-step-equations","distributive-property","combining-like-terms"]),
  skill("systems-equations","Systems of Equations","Algebra","Equations & Systems",["linear-equations"]),
  skill("linear-inequalities","Linear Inequalities","Algebra","Inequalities",["integer-operations","linear-equations"]),
  skill("slope-linear-graphs","Slope and Linear Graphs","Algebra","Functions & Graphs",["unit-rates"]),
  skill("function-tables","Function Tables and Rules","Algebra","Functions & Graphs"),
  skill("patterns-sequences","Patterns and Sequences","Algebra","Patterns & Sequences"),
  skill("angle-relationships","Angle Relationships","Geometry","Shapes & Angles"),
  skill("triangles-polygons","Triangles and Polygons","Geometry","Shapes & Angles",["angle-relationships"]),
  skill("area-perimeter","Area and Perimeter","Geometry","Area & Perimeter"),
  skill("circles","Circle Measurements","Geometry","Area & Perimeter"),
  skill("composite-area","Composite Area","Geometry","Area & Perimeter",["area-perimeter","circles"]),
  skill("surface-area","Surface Area","Geometry","Surface Area & Volume",["area-perimeter"]),
  skill("volume","Volume","Geometry","Surface Area & Volume",["area-perimeter"]),
  skill("coordinate-distance","Coordinate Distance and Locations","Geometry","Coordinate Geometry"),
  skill("pythagorean-theorem","Pythagorean Theorem","Geometry","Pythagorean Theorem",["exponents-roots"]),
  skill("scale-drawings","Scale Drawings","Geometry","Scale & Transformations",["proportional-relationships"]),
  skill("transformations","Transformations","Geometry","Scale & Transformations",["coordinate-distance"]),
  skill("read-data-displays","Read Data Displays","Statistics and Probability","Data Displays"),
  skill("simple-probability","Simple Probability","Statistics and Probability","Probability",["fraction-operations"]),
  skill("compound-probability","Compound Probability","Statistics and Probability","Probability",["simple-probability","counting-sets"]),
  skill("center-spread","Measures of Center and Spread","Statistics and Probability","Averages & Spread"),
  skill("ratio-comparisons","Ratio Comparisons","Ratios and Proportional Relationships","Ratios & Proportions"),
  skill("proportional-relationships","Proportional Relationships","Ratios and Proportional Relationships","Ratios & Proportions",["ratio-comparisons"]),
  skill("unit-rates","Unit Rates","Ratios and Proportional Relationships","Rates & Unit Rates"),
  skill("percent-amounts","Percent Amounts","Ratios and Proportional Relationships","Percentages",["rational-conversions"]),
  skill("percent-change","Percent Change","Ratios and Proportional Relationships","Percentages",["percent-amounts"]),
];

export function validateMathDiagnosticSkills(skills:MathDiagnosticSkill[],taxonomy:MathTaxonomy) {
  if(!Array.isArray(skills)||skills.length>200)throw new Error("Use at most 200 diagnostic skills.");
  const ids=new Set<string>();
  for(const s of skills){
    if(!s||typeof s.id!=="string"||!s.id.trim()||s.id.length>120||ids.has(s.id))throw new Error("Diagnostic skills need unique IDs.");
    if(typeof s.label!=="string"||!s.label.trim()||s.label.length>160)throw new Error("Every diagnostic skill needs a short label.");
    if(!taxonomy.categories.some(c=>c.label===s.category&&c.topics.includes(s.subcategory)))throw new Error(`Choose an existing category and subcategory for ${s.label}.`);
    ids.add(s.id);
  }
  const nodes=new Map(skills.map(s=>[s.id,s]));
  const visiting=new Set<string>(),visited=new Set<string>();
  function visit(id:string){
    if(visiting.has(id))throw new Error("Prerequisite relationships cannot contain a cycle.");
    if(visited.has(id))return;
    visiting.add(id);
    const links=nodes.get(id)!.prerequisiteIds||[];
    if(!Array.isArray(links)||links.length>40||new Set(links).size!==links.length)throw new Error("Use unique prerequisite skills (at most 40 per skill).");
    for(const prior of links){if(!nodes.has(prior))throw new Error(`Unknown prerequisite skill: ${prior}`);visit(prior);}
    visiting.delete(id);visited.add(id);
  }
  skills.forEach(s=>visit(s.id));
  return skills.map(s=>({...s,label:s.label.trim(),prerequisiteIds:[...(s.prerequisiteIds||[])],standardReferences:[...(s.standardReferences||[])]}));
}
