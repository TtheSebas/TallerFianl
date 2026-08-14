/**
 * @fileoverview Unit tests for QuoteService.
 *
 * Uses a mock QuoteRepository injected via constructor to isolate
 * business logic from the database.
 */

import { QuoteService } from '../src/services/quotes.service';
import { QuoteRepository } from '../src/repositories/quote.repository';
import { Quote, QuoteStatus, QuoteRequest } from '../src/types';

/* ------------------------------------------------------------------ */
/*  Mock setup                                                        */
/* ------------------------------------------------------------------ */

// Prevent real emails from being sent during tests.
jest.mock('../src/utils/email', () => ({
  sendQuoteConfirmation: jest.fn().mockResolvedValue(undefined),
}));

/** Build a fake Quote record for test assertions. */
function makeFakeQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    id: 'test-id-1234',
    customerName: 'María García',
    customerEmail: 'maria@example.com',
    customerPhone: '+52 55 1234 5678',
    shippingAddress: 'Av. Reforma 222, CDMX',
    items: [
      {
        productId: 'prod-1',
        productName: 'Mesa de comedor Roble',
        quantity: 1,
        unitPrice: 12500,
      },
      {
        productId: 'prod-2',
        productName: 'Silla tapizada Gris',
        quantity: 4,
        unitPrice: 3200,
      },
    ],
    subtotal: 25300,
    tax: 4048,
    total: 29348,
    status: QuoteStatus.PENDING,
    notes: null,
    estimatedDeliveryDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/** Create a mock repository with jest.fn() methods. */
function createMockRepo() {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
    findAll: jest.fn(),
  } as unknown as jest.Mocked<QuoteRepository>;
}

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('QuoteService', () => {
  let service: QuoteService;
  let mockRepo: jest.Mocked<QuoteRepository>;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new QuoteService(mockRepo);
  });

  /* ------ createQuote ------------------------------------------- */

  describe('createQuote', () => {
    it('should create a quote with calculated totals and PENDING status', async () => {
      const request: QuoteRequest = {
        customerName: 'María García',
        customerEmail: 'maria@example.com',
        shippingAddress: 'Av. Reforma 222, CDMX',
        items: [
          { productId: 'p1', productName: 'Mesa Roble', quantity: 1, unitPrice: 10000 },
          { productId: 'p2', productName: 'Silla Gris', quantity: 2, unitPrice: 3000 },
        ],
      };

      // The repo.create should return whatever it receives (with DB defaults)
      mockRepo.create.mockImplementation(async (q: Quote) => q);

      const result = await service.createQuote(request);

      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(result.status).toBe(QuoteStatus.PENDING);

      // Subtotal: 10000*1 + 3000*2 = 16000
      expect(result.subtotal).toBe(16000);
      // Tax: 16000 * 0.16 = 2560
      expect(result.tax).toBe(2560);
      // Total: 18560
      expect(result.total).toBe(18560);
    });

    it('should throw when customerName is missing', async () => {
      const request = {
        customerName: '',
        customerEmail: 'test@test.com',
        shippingAddress: 'Addr',
        items: [{ productId: 'p1', productName: 'X', quantity: 1, unitPrice: 100 }],
      } as QuoteRequest;

      await expect(service.createQuote(request)).rejects.toThrow(
        'customerName y customerEmail son obligatorios',
      );
    });

    it('should throw when items array is empty', async () => {
      const request: QuoteRequest = {
        customerName: 'Test',
        customerEmail: 'test@test.com',
        shippingAddress: 'Addr',
        items: [],
      };

      await expect(service.createQuote(request)).rejects.toThrow(
        'al menos un artículo',
      );
    });
  });

  /* ------ getQuoteById ------------------------------------------ */

  describe('getQuoteById', () => {
    it('should return the quote when it exists', async () => {
      const fakeQuote = makeFakeQuote();
      mockRepo.findById.mockResolvedValue(fakeQuote);

      const result = await service.getQuoteById('test-id-1234');

      expect(mockRepo.findById).toHaveBeenCalledWith('test-id-1234');
      expect(result).toEqual(fakeQuote);
    });

    it('should throw 404 when the quote does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.getQuoteById('nonexistent')).rejects.toThrow(
        'Cotización no encontrada',
      );
    });
  });

  /* ------ updateQuoteStatus ------------------------------------- */

  describe('updateQuoteStatus', () => {
    it('should transition PENDING → REVIEWING', async () => {
      const pending = makeFakeQuote({ status: QuoteStatus.PENDING });
      const reviewing = makeFakeQuote({ status: QuoteStatus.REVIEWING });

      mockRepo.findById.mockResolvedValue(pending);
      mockRepo.updateStatus.mockResolvedValue(reviewing);

      const result = await service.updateQuoteStatus('test-id-1234', QuoteStatus.REVIEWING);

      expect(mockRepo.updateStatus).toHaveBeenCalledWith('test-id-1234', QuoteStatus.REVIEWING);
      expect(result.status).toBe(QuoteStatus.REVIEWING);
    });

    it('should transition REVIEWING → APPROVED', async () => {
      const reviewing = makeFakeQuote({ status: QuoteStatus.REVIEWING });
      const approved = makeFakeQuote({ status: QuoteStatus.APPROVED });

      mockRepo.findById.mockResolvedValue(reviewing);
      mockRepo.updateStatus.mockResolvedValue(approved);

      const result = await service.updateQuoteStatus('test-id-1234', QuoteStatus.APPROVED);
      expect(result.status).toBe(QuoteStatus.APPROVED);
    });

    it('should transition REVIEWING → REJECTED', async () => {
      const reviewing = makeFakeQuote({ status: QuoteStatus.REVIEWING });
      const rejected = makeFakeQuote({ status: QuoteStatus.REJECTED });

      mockRepo.findById.mockResolvedValue(reviewing);
      mockRepo.updateStatus.mockResolvedValue(rejected);

      const result = await service.updateQuoteStatus('test-id-1234', QuoteStatus.REJECTED);
      expect(result.status).toBe(QuoteStatus.REJECTED);
    });

    it('should transition APPROVED → COMPLETED', async () => {
      const approved = makeFakeQuote({ status: QuoteStatus.APPROVED });
      const completed = makeFakeQuote({ status: QuoteStatus.COMPLETED });

      mockRepo.findById.mockResolvedValue(approved);
      mockRepo.updateStatus.mockResolvedValue(completed);

      const result = await service.updateQuoteStatus('test-id-1234', QuoteStatus.COMPLETED);
      expect(result.status).toBe(QuoteStatus.COMPLETED);
    });

    it('should reject invalid transition PENDING → APPROVED', async () => {
      const pending = makeFakeQuote({ status: QuoteStatus.PENDING });
      mockRepo.findById.mockResolvedValue(pending);

      await expect(
        service.updateQuoteStatus('test-id-1234', QuoteStatus.APPROVED),
      ).rejects.toThrow('Transición inválida');
    });

    it('should reject transition from COMPLETED', async () => {
      const completed = makeFakeQuote({ status: QuoteStatus.COMPLETED });
      mockRepo.findById.mockResolvedValue(completed);

      await expect(
        service.updateQuoteStatus('test-id-1234', QuoteStatus.PENDING),
      ).rejects.toThrow('Transición inválida');
    });

    it('should reject transition from REJECTED', async () => {
      const rejected = makeFakeQuote({ status: QuoteStatus.REJECTED });
      mockRepo.findById.mockResolvedValue(rejected);

      await expect(
        service.updateQuoteStatus('test-id-1234', QuoteStatus.REVIEWING),
      ).rejects.toThrow('Transición inválida');
    });
  });
});
