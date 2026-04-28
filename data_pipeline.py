#!/usr/bin/env python3
"""
College Event Portal - Data Processing Pipeline

Purpose: Extract, Transform, and Load (ETL) raw event data for analytics
This script validates, cleans, and standardizes event data from CSV format

Academic Components:
- Data quality assessment
- Missing value handling
- Data standardization
- Type conversion and validation
"""

import pandas as pd
import os
import sys
from datetime import datetime
import logging

# ==========================================
# CONFIGURATION
# ==========================================
INPUT_FILE = 'raw_events.csv'
OUTPUT_FILE = 'clean_events.csv'
LOG_FILE = 'data_pipeline.log'

# Configure logging for audit trail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


# ==========================================
# STEP 1: LOAD RAW DATA
# ==========================================
def load_raw_data(filepath):
    """
    Load CSV file into pandas DataFrame
    
    Args:
        filepath (str): Path to raw_events.csv
        
    Returns:
        pd.DataFrame: Loaded data or None if file not found
    """
    try:
        if not os.path.exists(filepath):
            logger.error(f"Input file not found: {filepath}")
            logger.info("Creating sample raw_events.csv for demonstration...")
            create_sample_data(filepath)
        
        df = pd.read_csv(filepath)
        logger.info(f"Loaded {len(df)} rows from {filepath}")
        logger.info(f"Columns: {list(df.columns)}")
        return df
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        sys.exit(1)


# ==========================================
# STEP 2: REMOVE DUPLICATE ROWS
# ==========================================
def remove_duplicates(df):
    """
    Identify and remove duplicate event records
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with duplicates removed
    """
    initial_count = len(df)
    
    # Remove exact row duplicates (all columns identical)
    df_clean = df.drop_duplicates()
    
    duplicate_count = initial_count - len(df_clean)
    logger.info(f"Removed {duplicate_count} duplicate rows")
    logger.info(f"Remaining rows: {len(df_clean)}")
    
    return df_clean


# ==========================================
# STEP 3: STANDARDIZE CATEGORY VALUES
# ==========================================
def standardize_categories(df):
    """
    Normalize category values: convert to title case, trim whitespace
    Handle common variations (e.g., 'COMPITION' -> 'Competition')
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with standardized categories
    """
    if 'category' not in df.columns:
        logger.warning("'category' column not found in data")
        return df
    
    # Create standardization mapping for common variations
    category_mapping = {
        'compition': 'Competition',
        'comp': 'Competition',
        'seminar': 'Seminar',
        'festival': 'Festival',
        'exhibition': 'Exhibition',
        'sports': 'Sports',
        'conference': 'Conference',
        'workshop': 'Workshop'
    }
    
    def normalize_category(value):
        """Convert category to normalized format"""
        if pd.isna(value):
            return 'Uncategorized'
        
        # Strip whitespace and convert to lowercase for mapping
        normalized = str(value).strip().lower()
        
        # Check if value matches any mapping key
        if normalized in category_mapping:
            return category_mapping[normalized]
        
        # Return title-cased original if no mapping found
        return str(value).strip().title()
    
    # Apply normalization
    df['category'] = df['category'].apply(normalize_category)
    logger.info("Standardized category values")
    logger.info(f"Unique categories: {df['category'].unique().tolist()}")
    
    return df


# ==========================================
# STEP 4: CONVERT DATE COLUMN TO DATETIME
# ==========================================
def convert_dates(df):
    """
    Convert date column to pandas datetime format
    Handle multiple date formats automatically
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with datetime conversion
    """
    if 'date' not in df.columns:
        logger.warning("'date' column not found in data")
        return df
    
    try:
        # Attempt to parse dates with flexible format detection
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        
        # Check for parsing failures
        failed_dates = df['date'].isna().sum()
        if failed_dates > 0:
            logger.warning(f"Failed to parse {failed_dates} date values")
        
        logger.info(f"Date range: {df['date'].min()} to {df['date'].max()}")
        return df
    except Exception as e:
        logger.error(f"Error converting dates: {str(e)}")
        return df


# ==========================================
# STEP 5: HANDLE MISSING VALUES
# ==========================================
def handle_missing_values(df):
    """
    Identify and handle missing/null values
    - Remove rows with critical missing values
    - Fill non-critical nulls with defaults
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Dataframe with handled missing values
    """
    initial_count = len(df)
    
    # Log missing values summary
    missing_summary = df.isnull().sum()
    if missing_summary.sum() > 0:
        logger.info("Missing value summary:")
        for col, count in missing_summary[missing_summary > 0].items():
            logger.info(f"  {col}: {count} ({count/len(df)*100:.2f}%)")
    
    # Define critical columns (must have values)
    critical_columns = ['title', 'category', 'date', 'venue', 'organizer']
    
    # Remove rows missing critical columns
    for col in critical_columns:
        if col in df.columns:
            df = df[df[col].notna()]
    
    removed_count = initial_count - len(df)
    if removed_count > 0:
        logger.info(f"Removed {removed_count} rows with missing critical values")
    
    # Fill non-critical missing values
    fill_defaults = {
        'description': 'No description provided',
        'department': 'General'
    }
    
    for col, default_value in fill_defaults.items():
        if col in df.columns:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                df[col] = df[col].fillna(default_value)
                logger.info(f"Filled {null_count} missing values in '{col}' column")
    
    return df


# ==========================================
# STEP 6: DATA VALIDATION
# ==========================================
def validate_data(df):
    """
    Perform data quality checks and validation
    
    Args:
        df (pd.DataFrame): Input dataframe
        
    Returns:
        pd.DataFrame: Validated dataframe
    """
    logger.info("Performing data quality checks...")
    
    validation_errors = []
    
    # Check required columns exist
    required_columns = ['title', 'category', 'date', 'venue', 'organizer']
    missing_cols = [col for col in required_columns if col not in df.columns]
    
    if missing_cols:
        validation_errors.append(f"Missing required columns: {missing_cols}")
    
    # Check for remaining null values in critical columns
    for col in required_columns:
        if col in df.columns:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                validation_errors.append(f"Column '{col}' still has {null_count} null values")
    
    # Check date validity
    if 'date' in df.columns:
        future_dates = (df['date'] > pd.Timestamp.now()).sum()
        if future_dates > 0:
            logger.warning(f"Found {future_dates} future event dates")
    
    # Log validation results
    if validation_errors:
        logger.warning("Validation issues found:")
        for error in validation_errors:
            logger.warning(f"  - {error}")
    else:
        logger.info("Data validation passed successfully!")
    
    return df


# ==========================================
# STEP 7: SAVE CLEANED DATA
# ==========================================
def save_cleaned_data(df, filepath):
    """
    Export cleaned data to CSV file
    
    Args:
        df (pd.DataFrame): Cleaned dataframe
        filepath (str): Output file path
    """
    try:
        df.to_csv(filepath, index=False)
        logger.info(f"Cleaned data saved to {filepath}")
        logger.info(f"Output file size: {os.path.getsize(filepath)} bytes")
        
        # Print summary statistics
        logger.info("=== Data Processing Summary ===")
        logger.info(f"Total records: {len(df)}")
        logger.info(f"Total columns: {len(df.columns)}")
        logger.info(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
        
    except Exception as e:
        logger.error(f"Error saving cleaned data: {str(e)}")
        sys.exit(1)


# ==========================================
# SAMPLE DATA GENERATION (for testing)
# ==========================================
def create_sample_data(filepath):
    """
    Create sample raw_events.csv for demonstration if file doesn't exist
    
    Args:
        filepath (str): Path where sample file will be created
    """
    sample_data = {
        'title': [
            'Code Sprint 2024',
            'Code Sprint 2024',  # Duplicate for testing
            'Tech Talk Seminar',
            'COMPITION Day',
            'Festival',
        ],
        'category': [
            'COMPETITION',
            'Competition',  # Duplicate
            'Seminar',
            'COMPITION',  # Variation
            'Festival',
        ],
        'date': [
            '2024-03-15',
            '2024-03-15',
            '2024-04-20',
            '2024-05-10',
            '2024-06-01',
        ],
        'venue': [
            'Tech Hall',
            'Tech Hall',
            'Auditorium',
            'Ground',
            'Amphitheater',
        ],
        'organizer': [
            'CSE Dept  ',  # Extra whitespace for testing
            'CSE Dept',
            'Dept Admin',
            'Sports Committee',
            'Cultural Fest',
        ],
        'department': [
            'Computer Science',
            'Computer Science',
            'General',
            None,  # Missing value
            'General',
        ]
    }
    
    df_sample = pd.DataFrame(sample_data)
    df_sample.to_csv(filepath, index=False)
    logger.info(f"Created sample {filepath} for demonstration")


# ==========================================
# MAIN EXECUTION PIPELINE
# ==========================================
def main():
    """
    Execute complete data processing pipeline
    """
    logger.info("=" * 60)
    logger.info("College Event Portal - Data Processing Pipeline")
    logger.info(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)
    
    # Step 1: Load data
    df = load_raw_data(INPUT_FILE)
    if df is None:
        return
    
    # Step 2: Remove duplicates
    df = remove_duplicates(df)
    
    # Step 3: Standardize categories
    df = standardize_categories(df)
    
    # Step 4: Convert dates
    df = convert_dates(df)
    
    # Step 5: Handle missing values
    df = handle_missing_values(df)
    
    # Step 6: Validate data
    df = validate_data(df)
    
    # Step 7: Save cleaned data
    save_cleaned_data(df, OUTPUT_FILE)
    
    logger.info("=" * 60)
    logger.info(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)


if __name__ == '__main__':
    main()
