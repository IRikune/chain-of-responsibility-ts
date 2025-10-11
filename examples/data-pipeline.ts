import { createChain, createStep } from "../mod.ts";

// Define context for data processing pipeline
type DataContext = {
  rawData: string[];
  cleanedData: string[];
  transformedData: number[];
  statistics: {
    count: number;
    sum: number;
    average: number;
    min: number;
    max: number;
  };
  errors: string[];
};

// Step 1: Data validation and cleaning
const cleanData = createStep<DataContext>(async (ctx, next) => {
  console.log("🧹 Starting data cleaning...");
  
  const rawData = ctx.get("rawData");
  const errors = ctx.get("errors") || [];
  const cleaned: string[] = [];
  
  for (const item of rawData) {
    if (typeof item === "string" && item.trim().length > 0) {
      // Remove extra whitespace and convert to lowercase
      cleaned.push(item.trim().toLowerCase());
    } else {
      errors.push(`Invalid data item: ${item}`);
    }
  }
  
  ctx.set("cleanedData", cleaned);
  ctx.set("errors", errors);
  
  console.log(`✓ Cleaned ${cleaned.length} items, ${errors.length} errors found`);
  await next();
});

// Step 2: Data transformation
const transformData = createStep<DataContext>(async (ctx, next) => {
  console.log("🔄 Starting data transformation...");
  
  const cleanedData = ctx.get("cleanedData");
  const errors = ctx.get("errors") || [];
  const transformed: number[] = [];
  
  for (const item of cleanedData) {
    // Try to extract numeric values (simulate parsing)
    const numMatch = item.match(/\d+/);
    if (numMatch) {
      transformed.push(parseInt(numMatch[0], 10));
    } else {
      errors.push(`Could not extract number from: ${item}`);
    }
  }
  
  ctx.set("transformedData", transformed);
  ctx.set("errors", errors);
  
  console.log(`✓ Transformed ${transformed.length} items`);
  await next();
});

// Step 3: Calculate statistics
const calculateStatistics = createStep<DataContext>(async (ctx, next) => {
  console.log("📊 Calculating statistics...");
  
  const data = ctx.get("transformedData");
  
  if (data.length === 0) {
    console.log("⚠️ No data to calculate statistics");
    await next();
    return;
  }
  
  const statistics = {
    count: data.length,
    sum: data.reduce((sum, val) => sum + val, 0),
    average: 0,
    min: Math.min(...data),
    max: Math.max(...data)
  };
  
  statistics.average = statistics.sum / statistics.count;
  
  ctx.set("statistics", statistics);
  
  console.log(`✓ Statistics calculated:`, {
    count: statistics.count,
    sum: statistics.sum,
    average: statistics.average.toFixed(2),
    min: statistics.min,
    max: statistics.max
  });
  
  await next();
});

// Step 4: Generate report
const generateReport = createStep<DataContext>(async (ctx, next) => {
  console.log("📄 Generating report...");
  
  const statistics = ctx.get("statistics");
  const errors = ctx.get("errors");
  
  console.log("\\n" + "=".repeat(50));
  console.log("📈 DATA PROCESSING REPORT");
  console.log("=".repeat(50));
  
  if (statistics) {
    console.log(`Total Records: ${statistics.count}`);
    console.log(`Sum: ${statistics.sum}`);
    console.log(`Average: ${statistics.average.toFixed(2)}`);
    console.log(`Minimum: ${statistics.min}`);
    console.log(`Maximum: ${statistics.max}`);
  }
  
  if (errors && errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  } else {
    console.log("\n✅ No errors found");
  }
  
  console.log("=" + "=".repeat(49));
  
  await next();
});

// Create sample datasets
const datasets = {
  valid: ["item1 100", "item2 250", "item3 75", "item4 300", "item5 125"],
  mixed: ["item1 100", "", "item3 200", "invalid", "item5 50", "  item6 175  "],
  numbers: ["100", "200", "300", "400", "500"]
};

// Run data processing pipeline
async function runDataPipeline(datasetName: keyof typeof datasets) {
  console.log(`\n=== Processing ${datasetName.toUpperCase()} Dataset ===`);
  
  const chain = createChain<DataContext>()
    .use(cleanData, transformData, calculateStatistics, generateReport)
    .setDelay(250);
  
  const context = await chain.run();
  
  // Initialize context with sample data
  context.set("rawData", datasets[datasetName]);
  context.set("cleanedData", []);
  context.set("transformedData", []);
  context.set("errors", []);
  
  try {
    await chain.run();
    return {
      statistics: context.get("statistics"),
      errors: context.get("errors")
    };
  } catch (error) {
    console.error("Pipeline error:", error);
    return null;
  }
}

// Run examples with different datasets
async function runDataPipelineExample() {
  console.log("=== Data Processing Pipeline Example ===");
  
  // Process different types of datasets
  await runDataPipeline("valid");
  await runDataPipeline("mixed");
  await runDataPipeline("numbers");
  
  console.log("\n🏁 All pipeline examples completed!");
}

if (import.meta.main) {
  runDataPipelineExample();
}

export { runDataPipelineExample };
