<?php 


namespace Austen\Repositories;


interface ProductRepositoryInterface {

	public function all();

	public function get($id);

	public function find($slug);

	public function store($input);

	public function update($id, $input);

	public function destroy($id);

	public function types();

	public function getByType();

}