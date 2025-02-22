import { faker } from "@faker-js/faker";
import { VehicleImages } from "../../../../../src/domain/models/vehicle/classes/vehicleImages";

describe("VehicleImages", () => {
  it("should create VehicleImages with valid image URLs", () => {
    const validImages = [faker.image.url(), faker.image.url()];
    const vehicleImagesOrFailure = VehicleImages.create(validImages);

    expect(vehicleImagesOrFailure.isSuccess).toBe(true);
    expect(vehicleImagesOrFailure.getValue()).toBeInstanceOf(VehicleImages);
    expect(vehicleImagesOrFailure.getValue().value).toEqual(validImages);
  });

  it("should not create VehicleImages with more than 3 images", () => {
    const invalidImages = [
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
      faker.image.url()
    ];
    const vehicleImagesOrFailure = VehicleImages.create(invalidImages);

    expect(vehicleImagesOrFailure.isSuccess).toBe(false);
    expect(vehicleImagesOrFailure.getErrorMessage()).toContain(
      "Vehicle images can have at most 3 images."
    );
  });

  it("should insert a new image when there are fewer than 3 images", () => {
    const initialImages = [faker.image.url(), faker.image.url()];
    const vehicleImages = VehicleImages.create(initialImages).getValue();

    const newurl = faker.image.url();
    const insertResult = vehicleImages.insert(newurl);

    expect(insertResult.isSuccess).toBe(true);
    expect(insertResult.getValue().value).toEqual([...initialImages, newurl]);
  });

  it("should not insert a new image when there are already 3 images", () => {
    const initialImages = [faker.image.url(), faker.image.url(), faker.image.url()];
    const vehicleImages = VehicleImages.create(initialImages).getValue();

    const insertResult = vehicleImages.insert(faker.image.url());

    expect(insertResult.isSuccess).toBe(false);
    expect(insertResult.getErrorMessage()).toContain(
      "Cannot insert more images. Maximum of 3 images allowed."
    );
  });

  it("should remove an image from the list", () => {
    const imageToRemove = faker.image.url();
    const initialImages = [imageToRemove, faker.image.url()];
    const vehicleImages = VehicleImages.create(initialImages).getValue();

    const removeResult = vehicleImages.remove(imageToRemove);

    expect(removeResult.isSuccess).toBe(true);
    expect(vehicleImages.value).toEqual([initialImages[0]]);
  });

  it("should not remove an image if it's not in the list", () => {
    const initialImages = [faker.image.url(), faker.image.url()];
    const vehicleImages = VehicleImages.create(initialImages).getValue();

    const imageNotInList = faker.image.url();
    const removeResult = vehicleImages.remove(imageNotInList);

    expect(removeResult.isSuccess).toBe(false);
    expect(removeResult.getErrorMessage()).toContain(`Image not found: ${imageNotInList}`);
  });

  it("should handle remove correctly when the list is empty", () => {
    const initialImages: string[] = [];
    const vehicleImages = VehicleImages.create(initialImages).getValue();

    const imageToRemove = faker.image.url();
    const removeResult = vehicleImages.remove(imageToRemove);

    expect(removeResult.isSuccess).toBe(false);
    expect(removeResult.getErrorMessage()).toContain(`Image not found: ${imageToRemove}`);
  });
});
