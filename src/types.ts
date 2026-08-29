export type Language = 'en' | 'kn';

export type ServiceCategory = 
  | 'eswathu' 
  | 'certificates' 
  | 'tax_utilities' 
  | 'licenses' 
  | 'welfare' 
  | 'mgnregs' 
  | 'sanitation_water';

export interface ServiceItem {
  id: string;
  code: string;
  titleEn: string;
  titleKn: string;
  category: ServiceCategory;
  departmentEn: string;
  departmentKn: string;
  descriptionEn: string;
  descriptionKn: string;
  processingTimeDays: number;
  feeRs: number;
  mandatoryDocsEn: string[];
  mandatoryDocsKn: string[];
  sakalaEligible: boolean;
  onlineFormAvailable: boolean;
}

export interface CitizenGrievance {
  id: string;
  ticketNo: string;
  category: 'water_supply' | 'street_light' | 'drainage_clean' | 'road_repair' | 'waste_mgmt' | 'other';
  categoryEn: string;
  categoryKn: string;
  title: string;
  description: string;
  locationWard: string;
  reporterName: string;
  reporterPhone: string;
  submittedDate: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
  assignedOfficer: string;
  resolutionRemark?: string;
  resolvedDate?: string;
}

export interface TaxProperty {
  assessmentNo: string;
  ownerName: string;
  ownerNameKn: string;
  doorNo: string;
  wardNo: string;
  location: string;
  propertyTypeEn: string;
  propertyTypeKn: string;
  builtAreaSqFt: number;
  houseTaxRs: number;
  waterTaxRs: number;
  libraryCessRs: number;
  healthCessRs: number;
  totalDueRs: number;
  paymentStatus: 'Unpaid' | 'Paid' | 'Partial';
  lastPaidYear?: string;
  receiptNo?: string;
}

export interface MgnregsWork {
  id: string;
  workCode: string;
  workNameEn: string;
  workNameKn: string;
  location: string;
  estimatedCostLakhs: number;
  beneficiariesCount: number;
  startDate: string;
  status: 'Approved' | 'Ongoing' | 'Completed';
  category: 'Water Conservation' | 'Land Development' | 'Rural Connectivity' | 'Sanitation';
}

export interface GpdpProject {
  id: string;
  projectCode: string;
  titleEn: string;
  titleKn: string;
  financialYear: string;
  budgetRsLakhs: number;
  fundingScheme: '15th Finance Commission' | 'MGNREGS' | 'State Rural Fund' | 'Jal Jeevan Mission';
  sectorEn: string;
  sectorKn: string;
  completionPercentage: number;
  status: 'Planning' | 'In Progress' | 'Completed';
  geoTagLocation: string;
}

export interface GramSabhaMeeting {
  id: string;
  titleEn: string;
  titleKn: string;
  meetingDate: string;
  timeStr: string;
  venueEn: string;
  venueKn: string;
  agendaItemsEn: string[];
  agendaItemsKn: string[];
  status: 'Upcoming' | 'Completed' | 'Minutes Published';
  resolutionsPassedCount?: number;
  downloadUrl?: string;
}

export interface TenderNotice {
  id: string;
  tenderNo: string;
  titleEn: string;
  titleKn: string;
  estimatedCostRs: number;
  publishDate: string;
  closingDate: string;
  departmentEn: string;
  departmentKn: string;
  status: 'Active' | 'Under Evaluation' | 'Awarded';
  documentName: string;
}

export interface PanchayatOfficial {
  id: string;
  nameEn: string;
  nameKn: string;
  designationEn: string;
  designationKn: string;
  phone: string;
  email: string;
  wardOrRoleEn: string;
  wardOrRoleKn: string;
  officeHours: string;
  photoUrl: string;
  isLeader?: boolean;
}

export interface HeritageSite {
  id: string;
  nameEn: string;
  nameKn: string;
  period: string;
  significanceEn: string;
  significanceKn: string;
  locationEn: string;
  locationKn: string;
  deityOrStructureEn: string;
  deityOrStructureKn: string;
  timings: string;
  imageUrl: string;
}

export interface ShgProduct {
  id: string;
  nameEn: string;
  nameKn: string;
  shgGroupEn: string;
  shgGroupKn: string;
  categoryEn: string;
  categoryKn: string;
  priceRs: number;
  contactPhone: string;
  descriptionEn: string;
  descriptionKn: string;
  imageUrl: string;
}

export interface ApplicationSubmission {
  applicationNo: string;
  serviceId: string;
  serviceName: string;
  applicantName: string;
  applicantPhone: string;
  applicantAadhaar: string;
  address: string;
  submittedAt: string;
  estimatedDeliveryDate: string;
  status: 'Submitted' | 'Verified' | 'Approved';
  sakalaNumber: string;
}
