/**
 * @swagger
 * components:
 *   schemas:
 *     BaseError:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         message:
 *           type: string
 *
 *     DataTable:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         data:
 *           type: object
 *         total:
 *           type: integer
 *           format: int32
 *
 *     BaseResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         message:
 *           type: string
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Current page number
 *         length:
 *           type: integer
 *           description: Number of items per page
 *         search:
 *           type: string
 *           description: Search keyword
 */